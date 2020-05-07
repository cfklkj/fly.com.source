function Maps(){
    this.hash = new Map(),
    this.add = function(key, value){
        this.hash.set(key, value)
    }
    this.find = function(key){
       return this.hash.get(key) != null
    }
    this.del = function(key){
        this.hash.delete(key)
    }
    this.get =function(key){
        return this.hash.get(key)
    }
    this.findName = function(name, callBack){
        this.hash.forEach(element => {
            callBack(name, element)   
        });  
    }
}  
