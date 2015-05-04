#Mashjobs

Mashup d'API d'offres d'emplois avec backbone.

# Install

   npm install

Run the application
   grunt
   go to http://localhost:3000/

Grunt
	- jsbeautifier : pour indenter correctement tous les fichiers js
	- express : pour lancer le serveur.js
	- jshint : pour verifier la syntaxe js
	- less : pour le precompileur css
	- watch pour recharger le less lorsqu'on modifie un .less

server.js
	- Possède le chemin vers les librairies correspondantes

scripts
	- Contient toute la logique backbone côté client

assets
	- Contient tout le css dont les fichiers less
