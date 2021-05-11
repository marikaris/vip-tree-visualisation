<template>
  <div id="app">
    <TreeVisualisation :tree="tree"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TreeVisualisation from './components/TreeVisualisation.vue'

export default Vue.extend({
  name: 'App',
  components: {
    TreeVisualisation
  },
  data () {
    return {
      tree: '{ "files": { "panel" : { "path" : "" } }, "rootNode": "MT", "nodes": { "MT": { "type": "BOOL", "description": "Variant on MT chrom", "query": { "field": "#CHROM", "operator": "==", "value": "MT" }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "blaat" }, "outcomeMissing": { "nextNode": "blaat" } },"blaat": { "type": "EXISTS", "description": "blaat annotation exists", "field": "INFO/CSQ/blaat", "outcomeTrue": { "nextNode": "csq_exists" }, "outcomeFalse": { "nextNode": "csq_exists" } },"csq_exists": { "type": "EXISTS", "description": "CSQ annotation exists", "field": "INFO/CSQ/Gene", "outcomeTrue": { "nextNode": "genepanel" }, "outcomeFalse": { "nextNode": "exit_f" } },"genepanel": { "type": "BOOL", "description": "gene panel", "query": { "field": "INFO/CSQ/Gene", "operator": "in", "value": "file:panel" }, "outcomeTrue": { "nextNode": "mvl" }, "outcomeFalse": { "nextNode": "phenotype_match" } },"phenotype_match": { "type": "EXISTS", "description": "Phenotype match", "field": "INFO/CSQ/HPO", "outcomeTrue": { "nextNode": "mvl" }, "outcomeFalse": { "nextNode": "exit_f" } }, "mvl": { "type": "CATEGORICAL", "description": "Managed Variant List classification", "field": "INFO/VKGL_UMCG", "outcomeMap": { "P": { "nextNode": "exit_t" }, "LP": { "nextNode": "exit_t" }, "LB": { "nextNode": "exit_f" }, "B": { "nextNode": "exit_f" } }, "outcomeMissing": { "nextNode": "vkgl" }, "outcomeDefault": { "nextNode": "vkgl" } }, "vkgl": { "type": "CATEGORICAL", "description": "VKGL classification", "field": "INFO/VKGL", "outcomeMap": { "P": { "nextNode": "exit_t" }, "LP": { "nextNode": "exit_t" }, "LB": { "nextNode": "exit_f" }, "B": { "nextNode": "exit_f" } }, "outcomeMissing": { "nextNode": "filter" }, "outcomeDefault": { "nextNode": "filter" } }, "filter": { "type": "BOOL", "description": "All filters passed", "query": { "field": "FILTER", "operator": "==", "value": [ "PASS" ] }, "outcomeTrue": { "nextNode": "artefact" }, "outcomeFalse": { "nextNode": "exit_f" }, "outcomeMissing": { "nextNode": "artefact" } },"artefact": { "type": "BOOL", "description": "Variant on artefact list", "query": { "field": "INFO/MVLA", "operator": "==", "value": "DUMMY" }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "exit_f" }, "outcomeMissing": { "nextNode": "capice" } }, "capice": { "type": "BOOL", "description": "CAPICE score >= 0.2", "query": { "field": "INFO/CAP", "operator": ">=", "value": 0.2 }, "outcomeTrue": { "nextNode": "gnomad" }, "outcomeFalse": { "nextNode": "exit_f" }, "outcomeMissing": { "nextNode": "gnomad" } }, "gnomad": { "type": "BOOL", "description": "gnomAD_AF < 0.02", "query": { "field": "INFO/CSQ/gnomAD_AF", "operator": "<", "value": 0.02 }, "outcomeTrue": { "nextNode": "HLA" }, "outcomeFalse": { "nextNode": "exit_f" }, "outcomeMissing": { "nextNode": "HLA" } }, "HLA": { "type": "BOOL", "description": "HLA", "query": { "field": "INFO/CSQ/SYMBOL", "operator": "in", "value": ["HLA-A","HLA-B","HLA-C","HLA-DRB1","HLA-DRB5","HLA-DQA1","HLA-DQB1"] }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "five_prime" }, "outcomeMissing": { "nextNode": "five_prime" } },"five_prime": { "type": "BOOL", "description": "5 prime UTR", "query": { "field": "INFO/CSQ/Consequence", "operator": "contains", "value": ["5_prime_UTR_variant"] }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "inframe" }, "outcomeMissing": { "nextNode": "inframe" } },"inframe": { "type": "BOOL", "description": "inframe insertion or deletion", "query": { "field": "INFO/CSQ/Consequence", "operator": "contains_any", "value": ["inframe_deletion", "inframe_insertion"] }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "splice_acceptor" }, "outcomeMissing": { "nextNode": "splice_acceptor" } },"splice_acceptor": { "type": "BOOL", "description": "Splice acceptor", "query": { "field": "INFO/CSQ/Consequence", "operator": "contains_any", "value": ["splice_acceptor_variant", "splice_donor_variant", "splice_region_variant"] }, "outcomeTrue": { "nextNode": "exit_t" }, "outcomeFalse": { "nextNode": "intron" }, "outcomeMissing": { "nextNode": "exit_t" } },"intron": { "type": "BOOL", "description": "Intron", "query": { "field": "INFO/CSQ/Consequence", "operator": "contains_any", "value": ["intron_variant", "synonymous_variant"] }, "outcomeTrue": { "nextNode": "exit_f" }, "outcomeFalse": { "nextNode": "exit_t" }, "outcomeMissing": { "nextNode": "exit_t" } }, "exit_t": { "type": "LEAF", "class": "T" }, "exit_f": { "type": "LEAF", "class": "F" } }}'
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
