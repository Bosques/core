requirejs.config({

    //By default load any module IDs from js/lib
    baseUrl: ''

    ,bundles:{
        'bundle':['main']
    }

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    ,paths: {
        app: ''
    }
});

// Start the main app logic.
requirejs(['require', 'main'], function (require, main) {
    main.init();
});