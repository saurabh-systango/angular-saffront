/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
	
	config.extraPlugins = 'signature,youtube';




	config.toolbarGroups = [
		{ name: 'clipboard', groups: ['clipboard', 'undo'] },
		{ name: 'document', groups: ['mode', 'document', 'doctools'] },
		{ name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
		{ name: 'tools', groups: ['tools'] },
		{ name: 'forms', groups: ['forms'] },
		{ name: 'insert', groups: ['insert'] },
		{ name: 'styles', groups: ['styles'] },
		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
		'/',
		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
		{ name: 'links', groups: ['links'] },
		{ name: 'colors', groups: ['colors'] },
		'/',
		{ name: 'others', groups: ['others'] },
		{ name: 'about', groups: ['about'] }
	];



	config.removeButtons = 'subscript,Save,NewPage,Preview,Print,Cut,Copy,Paste,PasteText,Find,Replace,SelectAll,Scayt,Templates,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Subscript,Superscript,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,SpecialChar,Smiley,PageBreak,Iframe,About,ShowBlocks,Flash,Styles,Format,Anchor';

};