const builder = require('botbuilder');
const restify = require('restify');
const axios = require('axios');

// Server entry point
async function run() {
    // Bot Setup
    // Setup Restify Server
    let server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 8000, function () {
        console.log('%s listening to %s', server.name, server.url);
    });

    // Create chat bot
    let connector = new builder.ChatConnector({
        appId: '3fd698eb-f45f-4abd-86a8-e1af1846011e',
        appPassword: 'TzWcQkB72iJjiNcqnAgo78L'
    });

    let bot = new builder.UniversalBot(connector);
    server.post('/api/messages', connector.listen());

    console.log("tesr");
    
    // Update images
    update_images();

    // Setup dialogs
    image_dialog(bot);
}


// Available Images
let images= [];
function update_images() {
    axios.get('http://dicaprio.uphero.com/index.php').then((response) =>{
        images = response.data.images;
    });
}

// Image dialog
function image_dialog(bot) {
    bot.dialog('/', function (session) {

        console.log("in dialog");
        // Response
        // session.send(images.length);
        // session.endDialog(msg);

        let i=0;

        // Reusable fn
        let send_image = () => {

            i=(i+1)%images.length;

            if(!images.length) {
                return; // Images not ready yet
            }

            let msg = new builder.Message(session).attachments([{
                contentType: "image/jpeg",
                contentUrl: images[i].url
            }]);
            bot.send(msg);
        };

        // Send first one 
        send_image();

        // Subscribe her :)
        setInterval(send_image, 15000);
    });
}

// Run the server
run().catch(console.error);