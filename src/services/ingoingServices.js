const Ingoing = require("../models/ingoingModel")

class IngoingServices {

    async create_ingoing( metadata, document_id){
        try {
            const letter_id = metadata.letter_id || "TBC by Foreign Sender"
            const sender_body = metadata.sender_body || metadata.title;

            const date_written = metadata.date_written || null
            const date_forwarded = metadata.date_forwarded || null
            
            if( !document_id || !sender_body ) {
                const error = new Error("Required fields are missing");
                error.status = 400; throw error;
            }
            const created_letter = await Ingoing.create({document_id, letter_id, sender_body, date_forwarded, date_written})
            return created_letter

        } catch (err) {
            const error = new Error(`Ingoing letter creation failed:${err.message}`)
            error.status = 400;
            throw error
        }

    }
}
module.exports = new IngoingServices();
