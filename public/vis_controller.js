import { Status } from 'ui/vis/update_status';
class VisController {

    constructor(el, vis) {
      console.log("enter constructor");
      this.cpt = 0; //pour vérifier si les passages dans le render se font bien
      this.vis = vis;
      this.el = el;
      this.container = document.createElement('div'); //on crée une balise div dans container
      this.container.className = 'myvis-container-div'; //à laquelle on donne une classe nommée myvis-container-div
      this.container.innerHTML = '<p> je suis dans mon constructeur </p>'; //on met cela dans notre container et ça
      //va s'afficher dans la fenêtre graphique
      this.el.appendChild(this.container); //on ajoute container à el
      console.log("end constructor");
    }
    destroy() {
			console.log("enter destroy");
			this.container.innerHTML = '<p>je suis dans le destroy</p>';
			this.el.appendChild(this.container);
    }

    render(visData, status) {
    this.cpt++; //incrementation de cpt dans le render pour voir le nbr de passages
    console.log("enter render");
    //this.container.innerHTML = '<p>je suis dans le render'+this.cpt+'</p>';
    this.container.innerHTML = '<p>je suis dans le render '+this.cpt+'</p>';

    const table = visData.tables[0];
    const metrics = [];
    let bucketAgg;
    //on parcourt la liste des colonnes et on fait un traitement particulier pour la premiere ligne
    //de chaque colonne qui est le titre de la colonne
    table.columns.forEach((column, i) => {
        // we have multiple rows … first column is a bucket agg
        if (table.rows.length > 1 && i == 0) {
          bucketAgg = column.aggConfig;
          console.log("j'ai un bucket");
          return;
        }
        //parcourt les lignes pour formater les variables à afficher et les mettre dans un tableau
        //temporaire mieux ordonné que visData -> table
        table.rows.forEach(row => {
            const value = row[i];
            console.log("for each row, value = "+value);
            metrics.push({
            title: bucketAgg ? `${row[0]} ${column.title}` : column.title,
            value: row[i],
            formattedValue: column.aggConfig ? column.aggConfig.fieldFormatter('text')(value) : value,
            bucketValue: bucketAgg ? row[0] : null,
            aggConfig: column.aggConfig
            });
        });
    });
    //parcourt le tableau temporaire pour réellement créer le tableau dans le div d'affichage
    metrics.forEach(metric => {
        console.log("for each metric");
        const metricDiv = document.createElement(`div`);
        metricDiv.className = `myvis-metric-div`;
        metricDiv.innerHTML = `<b>${metric.title}:</b> ${metric.formattedValue}`;
        metricDiv.setAttribute('style', `font-size: ${this.vis.params.fontSize}pt`);
        //permet probablement d'appeler la fonction qui permet de cliquer sur notre graphe pour y ajouter un filtre :
        metricDiv.addEventListener('click', () => {
          if (!bucketAgg) return;
          const filter = bucketAgg.createFilter(metric.bucketValue);
          this.vis.API.queryFilter.addFilters(filter);
        });
  
        this.container.appendChild(metricDiv);
    });

    //ici on insert enfin notre résultat formaté dans la fenêtre graphique
    this.el.appendChild(this.container);
    console.log("visData = ");
    console.log(visData);

    //pas réussi à accéder aux "columns" et aux "rows" directement à partir de visData d'où la création
    //du requestHandler
    //console.log(visData.columns);
    //console.log(JSON.stringify(visData));

    console.log("row = ");
    console.log(table.rows);
    console.log("accès direct à un champ du tableau =");
    console.log(table.rows[0][0].value);
    console.log("column = ");
    console.log(table.columns);
    
    return new Promise(resolve => {
        resolve('when done rendering');
    });
    }
};
export { VisController };

