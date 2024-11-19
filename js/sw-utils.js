function actualizaCacheDinamico(dynamicCache, req, res){

    if(res.ok){
        return caches.open(dynamicCache).then(cache=>{
            cache.put(req, res.clone());
            return res.clone();
        });//cierre then
    }//cierreif
    else{
        return res;
    }
}