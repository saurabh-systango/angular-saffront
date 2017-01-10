CKEDITOR.plugins.add( 'signature', {
    icons: 'signature',
    init: function( editor ) {
        editor.addCommand( 'insertSignature', {
            exec: function( editor ) {
                var now = "${Email_Signature}"
                editor.insertHtml( '<em>' + now.toString() + '</em>' );
            }
        });
        editor.ui.addButton( 'signature', {
            label: 'Insert Signature',
            command: 'insertSignature',
            toolbar: 'colors'
        });
    }
});