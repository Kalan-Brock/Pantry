console.log('Powered by pantry.');

jQuery(document).ready( function($) {
    var path = window.location.pathname.replace('/amp', '');
    var activenav;

    switch(path) {
        case '/':
            activenav = 'home';
            break;
        case '/example':
            activenav = 'example';
            break;
        case '/blog':
            activenav = 'blog';
            break;
        default:
            activenav = 'blog';
            break;
    }

    $('li.nav-item.' + activenav).addClass('active');
});
