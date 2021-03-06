# StringBuilder [![Build Status](https://secure.travis-ci.org/delmosaurio/stringbuilder.png)](http://travis-ci.org/delmosaurio/stringbuilder)

An string builder for [Node.js](http://nodejs.org/)

### npm install

```
npm install stringbuilder
```

### Usage

```js
var StringBuilder = require('stringbuilder')

// create an StringBuilder();
var sb = new StringBuilder( {newline:'\r\n'} );
var sbInside = new StringBuilder( {newline:'\r\n'} );
  
// you can configure all new intances of the StringBuilder
// as default win32='\r\n' others='\n'
// StringBuilder.configure({newline:'\r\n'});

sb.append('some text') // append text
sb.append('{0:YYYY}', new Date()) // append text formatted
sb.appendLine('some text') // append a new line
sb.appendLine('{0:$ 0.1}', 50.1044) // append a new line formatted
ab.append( sbInside );  // append other StringBuilder into sb
                        // you can append text into `sbInside` after that                        

sbInside.append('another text');

```

extends the String 

```js
var StringBuilder = require('stringbuilder')

StringBuilder.extend('string');

'The current year is {0:YYYY}'.format(new Date(2013)); // The current year is 2013
or the same
String.format('The current year is {0:YYYY}', new Date(2013)); // The current year is 2013
```

### example

```js
var StringBuilder = require('stringbuilder')
  , fs = require('fs');

// Make an markdown file of the beatles
var data = {
    band: "The Beatles"
  , formed: new Date(1960)
  , discography: [
      { name: 'Sentimental Journey', created: new Date(1970), price: (Math.random()*10)+1 }
    , { name: 'Beaucoups of Blues', created: new Date(1970), price: (Math.random()*10)+1 }
    , { name: 'Ringo', created: new Date(1973), price: (Math.random()*10)+1 }
    , { name: 'Goodnight Vienna', created: new Date(1974), price: (Math.random()*10)+1 }
    , { name: 'Ringo\'s Rotogravure', created: new Date(1976), price: (Math.random()*10)+1 }
    , { name: 'Ringo the 4th', created: new Date(1977), price: (Math.random()*10)+1 }
  ]
};

var main = new StringBuilder()
  , discography = new StringBuilder();

// extend de String object
StringBuilder.extend('string');

var filename = './{0}.md'.format(data.band);

var stream = fs.createWriteStream( filename );

var namesRegex = /(John|Paul|George|Ringo)\s(Lennon|McCartney|Harrison|Starr)/g

main
  .appendLine('{0}', data.band)
  .appendLine()
  .append('{0} were an English rock band formed in Liverpool in {1:YYYY}.', data.band, data.formed)
  .append('They became the most commercially successful and critically ')
  .append('acclaimed act in the rock music era. The group\'s best-known ')
  .appendLine('lineup consisted of John Lennon, Paul McCartney, George Harrison, and Ringo Starr.')
  .replace(namesRegex, '[$1 $2](http://en.wikipedia.org/wiki/$1_$2)') // replace
  .appendLine()
  .appendLine('### Discography')
  .appendLine()
  .append(discography) // append an StringBuilder
  .appendLine()
  .appendLine('### Influences')  // then write more text
  .appendLine()
  .append('Their earliest influences include ')
  .appendLine('Elvis Presley, Carl Perkins, Little Richard and Chuck Berry ...')
  .appendLine()
  .appendLine('### Genres')  
  .appendLine('')
  .append('Originating as a skiffle group, the Beatles quickly embraced 1950s ')
  .append('rock and roll, and their repertoire ultimately expanded to include')
  .appendLine('a broad variety of pop music ...')
  .insert('## ', 0) // Insert text
  ;

// append into the discography stringbuilder
data.discography.forEach(function(disk){
  discography.appendLine(' - {0} in {1:YYYY}   *{2:$ 0,0.00 } release price*', disk.name, disk.created, disk.price);
});

var filename = './{0}.md'.format(data.band);
var stream = fs.createWriteStream( filename, 'utf-8' );

main.pipe(stream);
main.flush();
```

output

## The Beatles

The Beatles were an English rock band formed in Liverpool in 1969They became the most commercially successful and critically acclaimed act in the rock music era. The group's best-known lineup consisted of [John Lennon](http://en.wikipedia.org/wiki/John_Lennon), [Paul McCartney](http://en.wikipedia.org/wiki/Paul_McCartney), [George Harrison](http://en.wikipedia.org/wiki/George_Harrison), and [Ringo Starr](http://en.wikipedia.org/wiki/Ringo_Starr).

### Discography

 - Sentimental Journey in 1969   *$ 3.474 release price*
 - Beaucoups of Blues in 1969   *$ 10.012 release price*
 - Ringo in 1969   *$ 3.375 release price*
 - Goodnight Vienna in 1969   *$ 2.687 release price*
 - Ringo's Rotogravure in 1969   *$ 7.972 release price*
 - Ringo the 4th in 1969   *$ 3.421 release price*

### Influences

Their earliest influences include Elvis Presley, Carl Perkins, Little Richard and Chuck Berry ...

### Genres

Originating as a skiffle group, the Beatles quickly embraced 1950s rock and roll, and their repertoire ultimately expanded to include a broad variety of pop music ...


----------------------------------------

### build html

NOTE: The idea of this example is show you how create parts of one output string separately and then combine all of them, if you need makes html can use a template engine like [handlebars](http://handlebarsjs.com/), this is only an example

```js
var html = new StringBuilder()
  , head = new StringBuilder({ newline: '\r\n\t' }) // add a tab at the end
  , body = new StringBuilder({ newline: '\r\n\t' }) // add a tab at the end
  ;

var initTag, endTag, tag, attr, lorem;

initTag = '<{0}>';
endTag = '</{0}>';
tag = '{0}{{1}}{1}'.format(initTag, endTag);
attr = '{0}="{1}"';
lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

// make the body
body.append('\t')
  .appendLine(tag.format('h1', 'StringBuilder example'))
  .append(tag.format('p', lorem));

// make the head
head.append('\t')
  .appendLine('<meta {0}>', attr.format('charset', 'UTF-8'))
  .appendLine('<meta {0} {1}>', attr.format('http-equiv', 'X-UA-Compatible'), attr.format('content', 'IE=edge'))
  .append(tag.format('title', 'Generate html with StringBuilder'));

// make the html
html.appendLine('<!doctype html>')
  .appendLine('<html {0}>', attr.format('lang', 'en'))

  // head
  .appendLine(initTag.format('head'))
  .append(head)
  .appendLine()
  .appendLine(endTag.format('head'))

  // body
  .appendLine(initTag.format('body'))
  .append(body)
  .appendLine()
  .appendLine(endTag.format('body'))

  .append(endTag.format('html'));
```

output

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Generate html with StringBuilder</title>
</head>
<body>
  <h1>StringBuilder example</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
</body>
</html>
```
----------------------------------------

### formats

To apply formats please see [moment](http://momentjs.com/) and [numeral](http://numeraljs.com/)

```js
var sb = new StringBuilder();

sb.append('{0:format}');

```

dates examples

```js
sb.append('{0:L}', new date());      // 04/29/2013
sb.append('{0:LL}', new date());     // April 29 2013
sb.append('{0:LLL}', new date());    // April 29 2013 9:13 AM
sb.append('{0:LLLL}', new date());   // Monday, April 29 2013 9:13 AM
```

numbers examples

```js
sb.append('{0:$0,0.00}', 1000.234);   // $0,000.23
sb.append('{0:0%}', 1);               // 100%
sb.append('{0:0b}', 100);             // 100B
sb.append('{0:(0,0.0000)}', -10000);  // (10,000.0000)
```

## more information

### build trough

Please see [async](https://github.com/caolan/async)

This is the way that the StringBuilder makes the output string.

```
waterfall
  |-parallel
    |-sb.append(format, ...args)
    |-sb.append(string)
    |-sb.appendLine(format, ...args)
    |-sb.appendLine(string)
  |-sb.insert(...)
  |-sb.replace(...)
  |-parallel
    |-sb.append(format, ...args)
    |-sb.append(StringBuilder())
    |-sb.appendLine(string)
  |-sb.insert(...)
  |-parallel
    |-sb.append(format, ...args)
```

## license 

(The MIT License)

Copyright (c) 2012-2013 Delmo Carrozzo &lt;dcardev@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.