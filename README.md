# Social Timeline

Social Timeline was created as a beautiful way to present data collected using ThinkUp.

## About ThinkUp

ThinkUp is a PHP/MySQL application that captures your social interaction on sites like Twitter, Facebook, and Google+. Visit the [ThinkUp](http://thinkupapp.com) website for more informatiom.

## Getting Started

Social Timeline requires a [ThinkUp](http://thinkupapp.com) installation to communicate with. If your ThinkUp installation and Social Timeline are on different domains, you may need to modify your headers to allow the cross-origin request (I used [this guide](http://enable-cors.org/#how-apache) for Apache).

To display media you'll need the Expand URLs plugin enabled in ThinkUp and an [Embed.ly](http://embed.ly/) key (there *is* a free plan).

Create a directory for the timeline and upload all the necessary files. Next, make a copy of config.sample.js named config.js and enter the required settings. Enjoy!

## License

Social Timeline's source code is licensed under the
[GNU General Public License](http://www.gnu.org/licenses/gpl.html),
except for the  external libraries listed below.

## External Libraries

- [Twitter Bootstrap](https://github.com/twitter/bootstrap)
- [jQuery](http://jquery.com/)
- [Embed.ly](http://embed.ly/)