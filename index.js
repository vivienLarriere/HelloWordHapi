"use strict";
//Charge le framework Hapi et les plugins
const Hapi = require('hapi');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Inert = require('inert');

// Notre chemin vers notre gestionnaire d'URL
const routesPath = './routes/';


const launchServer = async function () {
    // définition de notre serveur sql
    // mysql://[user]:[password]@[serveur]/[base]
    const clientOpts = {
        settings: 'mysql://root:root@localhost/helloworldhapi',
        decorate: true
    };
    // définition des caractéristique de notre serveur Node.
    // Ici sur le port 8080 et sur l'adresse 'localhost'
    const server = Hapi.Server({port: 8080, host: 'localhost'});

    // Enregistre notre module faisant le lien entre hapi et MySQL
    await server.register({
        plugin : require('hapi-mysql2'),
        options: clientOpts
    });
    // Enregistre le module vision permettant l'interprétation des vues HTML
    await server.register(require('vision'));

    // Configuration de nos vues
    server.views({

        // Ici on signale l'utilisation de handlebars
        // Handlebars permet de gérer les vues sous la forme de templates
        // On pourra utiliser des boucles ou encore des variables dans nos vues HTML
        engines     : {
            html: require('handlebars')
        },

        // Les chemins vers nos templates
        path        : 'website/contents',
        layoutPath  : 'website',

        // Template principal
        layout      : 'index'
    });

    // Enregistre l'endroit où les URL de nos pages seront gérées
    server.route(require(routesPath + 'pagesRoutes'));

    // Lance notre serveur et attend que celui-ci ai terminé pour passer à la suite
    await server.start();
    console.log(`Server started at ${server.info.uri}`)
};

// Fait appel à notre constante pour lancer le serveur
// défini juste au dessus et catch les erreurs possibles
launchServer().catch(err => {
    console.error(err);
    process.exit(1)
});