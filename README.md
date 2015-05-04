Grunt :
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

modules
	- Contient le code du module annuaire légèrement modifié pour pouvoir prendre en compte l'ajout de tag

=======================

Pour installer l'application
   npm install

Pour lancer l'application (pas par la fenêtre)
   grunt
   aller à http://localhost:3000/
