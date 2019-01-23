

# lancer un bulk pour ajouter les données d'exemple de sankey
```
$ curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/bulk_sample"; echo
```