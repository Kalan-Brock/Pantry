console.log('Powered by Pantry.');

jQuery(document).ready( function($) {
    var path = window.location.pathname;

    if(path.substr(-1) === '/')
        path = path.slice(0, -1);

    if(path.indexOf('/blog') > -1)
        path = '/blog';

    if(path === '')
        path = '/';

    $("a.nav-item[href='" + path + "']").addClass('active');
});
