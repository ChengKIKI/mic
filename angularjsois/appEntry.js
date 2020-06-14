const render = $ => {
    //$('#angularjs-container').html('Hello, render with angularjs');
    
    return Promise.resolve();
  };
  
  (global => {
    global['angularjs1'] = {
      bootstrap: () => {
        console.log('angularjsois bootstrap');
        return Promise.resolve();
      },
      mount: () => {
        console.log('angularjsois mount');
        return render($);
      },
      unmount: () => {
        console.log('angularjsois unmount');
        return Promise.resolve();
      },
    };
  })(window);