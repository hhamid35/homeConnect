function importHeaderElements(importFiles){

    var hasElements=(typeof importFiles[0] !== 'undefined' && importFiles[0] !== null?true:false);
    var elementsCount=(hasElements?importFiles.length:0);

    if(hasElements && elementsCount>0){
        for(var i=0;i<elementsCount;i++){
            var jsFileLN=importFiles[i];
            if(jsFileLN.lastIndexOf(".js")!=-1){
                var jsScript=document.createElement('script');
                jsScript.type="text/javascript";
                jsScript.src=jsFileLN;
                jsScript.async = false;
                document.getElementsByTagName('head')[0].appendChild(jsScript);
            }else if(jsFileLN.lastIndexOf(".css")!=-1){
                var cssScript=document.createElement('link');
                cssScript.type='text/css';
                cssScript.href=jsFileLN;
                cssScript.rel='stylesheet';
                document.getElementsByTagName('head')[0].appendChild(cssScript);
            }
        }
    }else{
        alert("No files found to be added!")
    }
}


