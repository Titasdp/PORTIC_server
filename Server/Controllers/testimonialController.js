const TestimonialModel = require("../Models/Testimonial")

// Connection
const sequelize = require("../Database/connection")

//Middleware
const uniqueIdPack = require("../Middleware/uniqueId");
const fsPack = require("../Middleware/fsFunctions")


//Controllers
const pictureController = require("../Controllers/pictureController")
// const dataStatusController = require("../Controllers/dataStatusController")


// Env
require("dotenv").config();




/**
 * Fetch entity testimonial
 * Status : Completed
 */


const fetchEntityTestimonialsByIdEntity = async (dataObj) => {
    let processResp = {}

    if (!dataObj.req.sanitize(dataObj.req.params.lng) || !dataObj.req.params.id) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
            }
        }
        return processResp

    }
    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `select  Testimonial.person_name,Testimonial.institution_name,Testimonial.testimonial_text_pt as testimonial_text , Picture.img_path FROM  (Testimonial INNER JOIN Picture on Picture.id_picture = Testimonial.id_picture) Where Testimonial.id_entity= :id_entity` : `select  Testimonial.person_name,Testimonial.institution_name,Testimonial.testimonial_text_eng as testimonial_text , Picture.img_path FROM  (Testimonial INNER JOIN Picture on Picture.id_picture = Testimonial.id_picture) Where Testimonial.id_entity= :id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: TestimonialModel.Testimonial
        })
        .then(async data => {
            let testimonials = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let obj = {
                        person_name: el.person_name,
                        institution_name: el.institution_name,
                        testimonial_text: el.testimonial_text,
                        picture: process.env.API_URL + el.img_path,
                    }
                    testimonials.push(obj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: testimonials,
                    processError: null,
                    processMsg: respMsg,
                }
            }
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });

    return processResp
};

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Admin!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const fetchTestimonialsByAdmin = async (dataObj) => {
    let query = (dataObj.user_level === `Super Admin`) ? `select Testimonial.id_testimonial,Testimonial.person_name,Testimonial.institution_name,Testimonial.testimonial_text_eng, Testimonial.testimonial_text_pt , Picture.img_path, Entity.initials as entity FROM  ((Testimonial INNER JOIN Picture on Picture.id_picture = Testimonial.id_picture)
    INNER JOIN Entity on Entity.id_entity = Testimonial.id_entity)` : `select Testimonial.id_testimonial,Testimonial.person_name,Testimonial.institution_name,Testimonial.testimonial_text_eng, Testimonial.testimonial_text_pt , Picture.img_path, Entity.initials as entity FROM  ((Testimonial INNER JOIN Picture on Picture.id_picture = Testimonial.id_picture)
    INNER JOIN Entity on Entity.id_entity = Testimonial.id_entity) where Entity.id_entity = :id_entity`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: TestimonialModel.Testimonial
        })
        .then(async data => {
            console.log(data);
            let testimonials = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let obj = {
                        id_testimonial: el.id_testimonial,
                        person_name: el.person_name,
                        institution_name: el.institution_name,
                        testimonial_text_eng: el.testimonial_text_eng,
                        testimonial_text_pt: el.testimonial_text_pt,
                        entity_initials: el.entity,
                        picture: process.env.API_URL + el.img_path,
                    }
                    testimonials.push(obj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: testimonials,
                    processError: null,
                    processMsg: respMsg,
                }
            }
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });

    return processResp
};




/**
 *Add Testimonial
 *Status:Completed
 */
const addTestimonial = async (dataObj) => {
    let processResp = {}
    if (!dataObj.idUser || !dataObj.idEntity || !dataObj.req.sanitize(dataObj.req.body.person_name) || !dataObj.req.sanitize(dataObj.req.body.institution_name) || !dataObj.req.sanitize(dataObj.req.body.testimonial_text_pt) || !dataObj.req.sanitize(dataObj.req.body.testimonial_text_eng)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }


    let pictureUploadResult = await pictureController.addPictureOnCreate({
        folder: `/Images/FacePicture/`,
        req: dataObj.req
    })
    if (pictureUploadResult.processRespCode !== 201) {
        return pictureUploadResult
    }


    let insertArray = [
        [uniqueIdPack.generateRandomId('_Testimonial'), dataObj.req.sanitize(dataObj.req.body.person_name), dataObj.req.sanitize(dataObj.req.body.institution_name), dataObj.req.sanitize(dataObj.req.body.testimonial_text_pt), dataObj.req.sanitize(dataObj.req.body.testimonial_text_eng), dataObj.idEntity, pictureUploadResult.toClient.processResult.generatedId],
    ]
    await sequelize
        .query(
            `INSERT INTO Testimonial(id_testimonial,person_name,institution_name,testimonial_text_pt,testimonial_text_eng,id_entity,id_picture) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: TestimonialModel.Testimonial
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}


/**
 * Delete news  
 * Status: Complete
 */
const deleteTestimonial = async (dataObj) => {
    let fetchResult = await fetchTestimonialImgId(dataObj.req.sanitize(dataObj.req.params.id))

    if (fetchResult.processRespCode === 500) {
        return fetchResult
    }


    let deleteResult = {}
    if (fetchResult.toClient.processResult) {
        deleteResult = await pictureController.deletePictureInSystemById({
            req: dataObj.req,
            id_picture: fetchResult.toClient.processResult,
            folder: `/Images/FacePicture/`
        })
    }
    if (deleteResult.processRespCode !== 200) {
        return deleteResult
    } else {
        await sequelize
            .query(
                `DELETE FROM Testimonial Where Testimonial.id_testimonial=:id_testimonial;`, {
                    replacements: {
                        id_testimonial: dataObj.req.sanitize(dataObj.req.params.id)
                    },
                }, {
                    model: TestimonialModel.Testimonial
                }
            )
            .then(data => {
                processResp = {
                    processRespCode: 200,
                    toClient: {
                        processResult: data[0],
                        processError: null,
                        processMsg: "Data deleted Successfully",
                    }
                }

            })
            .catch(error => {
                console.log(error);
                processResp = {
                    processRespCode: 500,
                    toClient: {
                        processResult: null,
                        processError: null,
                        processMsg: "Something went wrong, please try again later.",
                    }
                }
            });

        return processResp
    }
}





//*Complement
/**
 * Fetches user data based on his username 
 * Status: Complete
 */
const fetchTestimonialImgId = async (id_testimonial) => {
    let processResp = {}
    await sequelize
        .query(`select id_picture from Testimonial where Testimonial.id_testimonial =:id_testimonial;`, {
            replacements: {
                id_testimonial: id_testimonial
            }
        }, {
            model: TestimonialModel.Testimonial
        })
        .then(data => {
            console.log(data);
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            // console.log(data[0][0].id_picture);
            // console.log(data[0].id_picture);
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: ((!data[0][0].id_picture) ? null : data[0][0].id_picture),
                    processError: null,
                    processMsg: respMsg,
                }
            }

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp
};





module.exports = {
    fetchEntityTestimonialsByIdEntity,
    // 
    fetchTestimonialsByAdmin,
    addTestimonial,
    deleteTestimonial,

}