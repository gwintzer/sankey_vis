/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { get, findLastIndex } from 'lodash';
import AggConfigResult from 'ui/vis/agg_config_result';

/**
 * Takes an array of tabified rows and splits them by column value:
 *
 * const rows = [
 *   { col-1: 'foo', col-2: 'X' },
 *   { col-1: 'bar', col-2: 50 },
 *   { col-1: 'baz', col-2: 'X' },
 * ];
 * const splitRows = splitRowsOnColumn(rows, 'col-2');
 * splitRows.results; // ['X', 50];
 * splitRows.rowsGroupedByResult; // { X: [{ col-1: 'foo' }, { col-1: 'baz' }], 50: [{ col-1: 'bar' }] }
 */
export function splitRowsOnColumn(rows, columnId) {
  const resultsMap = {}; // Used to preserve types, since object keys are always converted to strings.
  return {
    rowsGroupedByResult: rows.reduce((acc, row) => { // reduce prend en paramètre une fonction qui elle-même
      //prend en paramètres au moins 2 paramètres : ''total'' et ''currentValue'' : total prend la première
      //valeur du tableau ou bien la valeur retournée par la fonction tandis que currentValue prend la valeur
      //courante du tableau parcouru. La fonction va donc boucler x fois, x étant la taille du tableau.
      const { [columnId]: splitValue, ...rest } = row; // "..." --> spread syntax : ...tab <=> les valeurs du
      //tableaux. Par exemple si tab = [1, 2, 3] alors sum(...tab) = 6.
      resultsMap[splitValue] = splitValue;
      acc[splitValue] = [...(acc[splitValue] || []), rest];
      return acc;
    }, {}),
    results: Object.values(resultsMap), // Object.values(objet) permet de retourner les valeurs de l'objet sous
    //forme de tableau
  };
}

//dans cette méthode on pré-formate le tableau des données récupéré dans table.columns et table.rows
export function splitTable(columns, rows, $parent) {
  const splitColumn = columns.find(column => get(column, 'aggConfig.schema.name') === 'split'); //tab.find(fonction)
  //retourne la première valeur définie dans la fonction trouvée dans le tableau tab.

  if (!splitColumn) {
    return [{
      $parent,
      columns: columns.map(column => ({ title: column.name, ...column })), //tab.map(fonction) crée un tableau avec
      //les résultats de la fonction appelée pour chaque élément de tab
      rows: rows.map(row => {
        return columns.map(column => {
          return new AggConfigResult(column.aggConfig, $parent, row[column.id], row[column.id]);
        });
      })
    }];
  }

  const splitColumnIndex = columns.findIndex(column => column.id === splitColumn.id); // tab.findIndex(fonction) retourne l'index correspondant
  //à ce que l'on recherche dans la fonction donnée en paramètre
  const splitRows = splitRowsOnColumn(rows, splitColumn.id);

  // Check if there are buckets after the first metric.
  const firstMetricsColumnIndex = columns.findIndex(column => get(column, 'aggConfig.type.type') === 'metrics');
  const lastBucketsColumnIndex = findLastIndex(columns, column => get(column, 'aggConfig.type.type') === 'buckets');
  const metricsAtAllLevels = firstMetricsColumnIndex < lastBucketsColumnIndex;

  // Calculate metrics:bucket ratio.
  const numberOfMetrics = columns.filter(column => get(column, 'aggConfig.type.type') === 'metrics').length;
  const numberOfBuckets = columns.filter(column => get(column, 'aggConfig.type.type') === 'buckets').length;
  const metricsPerBucket = numberOfMetrics / numberOfBuckets;

  const filteredColumns = columns
    .filter((column, i) => {
      const isSplitColumn = i === splitColumnIndex;
      const isSplitMetric = metricsAtAllLevels && i > splitColumnIndex && i <= splitColumnIndex + metricsPerBucket;
      return !isSplitColumn && !isSplitMetric;
    })
    .map(column => ({ title: column.name, ...column }));

  return splitRows.results.map(splitValue => {
    const $newParent = new AggConfigResult(splitColumn.aggConfig, $parent, splitValue, splitValue);
    return {
      $parent: $newParent,
      aggConfig: splitColumn.aggConfig,
      title: `${splitColumn.aggConfig.fieldFormatter()(splitValue)}: ${splitColumn.aggConfig.makeLabel()}`,
      key: splitValue,
      // Recurse with filtered data to continue the search for additional split columns.
      tables: splitTable(filteredColumns, splitRows.rowsGroupedByResult[splitValue], $newParent),
    };
  });
}

//l'utilisation du responseHandler est obligatoire si on veut accéder directement au tableau de données "table",
//plutôt qu'utiliser l'incompréhensible objet visData passé dans "render"
export async function legacyTableResponseHandler(table) {
  console.log("table : ", table)
  //return { tables: splitTable(table.columns, table.rows, null)};
  return { tables: (table.columns, table.rows, null)};
}
