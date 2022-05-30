require("dotenv").config();
const axios = require("axios");

// HubSpot vars
const hubspot_prod_key = process.env.HUBSPOT_PROD_KEY;
const hs_properties = `properties=email&properties=firstname&properties=lastname&properties=phone&properties=tags`;
// const hubspotURL = `https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hubspot_prod_key}&${hs_properties}&limit=100`;
const hubspotURL = `https://api.hubapi.com/crm/v3/objects/contacts?hapikey=${hubspot_prod_key}&limit=100`;

// Mailchimp vars
const theMiningConference = process.env.MC_THE_MINING_CONFERENCE_KEY;
const theMiningConferenceId = "55af96de96";
const theMiningConferenceURL = `https://us20.api.mailchimp.com/3.0/lists/${theMiningConferenceId}`;

let hours = 3600000;
let minutes = 60000;
let seconds = 1000;

let count = 0;

function TheMiningConference() {
  var config = {
    method: "GET",
    url: hubspotURL,
    headers: {},
  };
  axios(config)
    .then(function (response) {
      const data = JSON.parse(JSON.stringify(response.data));
      data.results.map((contact) => {
        const property = contact.properties;
        const contacts = {
          properties: {
            email: property.email,
            firstname: property.firstname,
            lastname: property.lastname,
            phone: property.phone,
            tags: property.tags,
          },
        };
        updateList(contacts.properties);
        count++;
        console.log(count, contacts);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  function updateList(contact) {
    let data = JSON.stringify({
      members: [
        {
          update_existing: true,
          email_address: contact.email ? contact.email : " ",
          status: "subscribed",
          merge_fields: {
            FNAME: contact.firstname ? contact.firstname : " ",
            LNAME: contact.lastname ? contact.lastname : " ",
            PHONE: contact.phone ? contact.phone : " ",
          },
          tags: ["THE_MINING_CONFERENCE"],
        },
      ],
    });

    let config = {
      method: "POST",
      url: `${theMiningConferenceURL}?skip_merge_validation=true&skip_duplicate_check=true&count=100`,
      headers: {
        Authorization: `Bearer ${theMiningConference}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        const the_mining_conference_list = JSON.parse(
          JSON.stringify(response.data)
        );
        console.log("THE MINING CONFERENCE LIST: ", the_mining_conference_list);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }
}

module.exports = {
  TheMiningConference,
};
