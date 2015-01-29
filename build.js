({
    appDir: "./",
    baseUrl: "js",
    dir: "../csd",
    fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    paths: {
        "zepto": 'lib/zepto',
        "tweenMax": 'lib/TweenMax',
        "load": 'module/load',
        "anipic": 'module/anipic',
        "sprite": 'module/sprite',
        "box3d": 'module/threebox'
    },

    shim: {

        'zepto': {

            exports: 'Zepto'
        },

        'tweenMax': {

            exports: 'TweenMax'
        }
    },
    modules: [{
        name: "index"
    }]
})