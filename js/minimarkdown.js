/**
 * Minimarkdown.js v0.1
 * Author: Sebastian De Deyne
 */

(function(){
	
	var $input = $('#input');
	
	showPlaceholder();
	$input.on('blur', showPlaceholder);
	$input.on('focus', hidePlaceholder);
	
	mmd();
	$input.on('input', mmd);

	function mmd() {
		var source = $input.val(),
			split = '',
			parsed = '',
			cached = '',
			output = '';

		split = source
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/\*\*([^\n*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^\n*]+)\*/g, '<em>$1</em>')
			.replace(/\n\n+/g, '\n\n')
			.split('\n');


		$.each(split, function(i, str) {
			modifier = str.substr(0, 1);
			switch(modifier) {
				case '#':
					parseLine(str, 'h1');
					break;
				case '-':
					parseLine(str, 'li');
					break;
				case '!':
					parseLine(str, 'aside');
					break;
				case '':
					parseLine(str, 'br');
					break;
				default:
					parseLine(str, 'p');
					break;
			}

		});

		var prevType = null;
		function parseLine(str, type) {

			if(type == 'li' && prevType != 'li')
				parsed += '<ul>';
			if(type != 'li' && prevType == 'li')
				parsed += '</ul>';

			if(cached != '') {
				if(type == 'p' && prevType == 'p' || type == 'p' && prevType == 'br') {
					cache(str);
					return;
				} else {
					dumpCache();
				}
			}

			if(type == 'p' || type == 'br') {
				cache(str);
				prevType = type;
				return;
			}


			if(type != 'p')
				str = str.replace(/[^ ] */, '');
			str = str.replace(/\n/g, '<br>');
			parsed += '<' + type + '>' + str + '</' + type + '>';
			prevType = type;
		}

		output = parsed + '<p>' + cached + '</p>';

		function cache(str) {
			if(cached != '') {
				cached = cached + '<br>' + str;
			}
			else {
				cached = str;
			}
		}

		function dumpCache() {
			parsed += '<p>' + cached + '</p>';
			cached = '';
		}

		$('#output').html(output);
	}

	function showPlaceholder() {
		if($input.val() == '') {
			$input
				.addClass('virgin')
				.val('#Welcome to Minimarkdown v0.1!\n\nCurrently supports: \n\n#Headers\n\n-Unordered\n-Lists\n\nParagraphs with *italic* and **bold** text');
		}
	}

	function hidePlaceholder() {
		if($input.hasClass('virgin')) {
			$input
				.removeClass('virgin')
				.val('');
		}
	}

})();
