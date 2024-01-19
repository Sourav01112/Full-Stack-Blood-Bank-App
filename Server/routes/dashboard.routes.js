const mongoose = require("mongoose");
const express = require("express");
const dashboardRouter = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const InventoryModel = require("../model/inventory.model");



// Get All Blood Groups (Total In, Total Out, Available Quantity)

dashboardRouter.post('/bloodGroup-data-all', authMiddleware, async (req, res) => {
    try {
        const allBloodGroup = [
            "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
        ]

        const bloodGroupData = []
        const organization = new mongoose.Types.ObjectId(req.body.userID);
        // const organization = new mongoose.Types.ObjectId(req.body.userId);

        async function asyncOperation() {
            await Promise.all(
                allBloodGroup.map(async (bloodGroup) => {

                    try {
                        const totalINpipeline = await InventoryModel.aggregate([
                            {
                                $match: {
                                    organization,
                                    bloodGroup: bloodGroup,
                                    inventoryType: "Incoming",
                                },
                            },
                            {
                                $group: {
                                    _id: "$bloodGroup",
                                    total: { $sum: "$quantity" },
                                },
                            },
                        ]);

                        const totalOUTpipeline = await InventoryModel.aggregate([
                            {
                                $match: {
                                    organization,
                                    bloodGroup: bloodGroup,
                                    inventoryType: "Outgoing",
                                },
                            },
                            {
                                $group: {
                                    _id: "null",
                                    total: { $sum: "$quantity" },
                                },
                            },
                        ]);

                        const totalINCOMING = totalINpipeline[0]?.total || 0
                        const totalOUTGOING = totalOUTpipeline[0]?.total || 0

                        const avaialbleQuantity = totalINCOMING - totalOUTGOING

                        bloodGroupData.push({
                            bloodGroup,
                            totalIN: totalINCOMING,
                            totalOUT: totalOUTGOING,
                            avaialbleQuantity
                        })


                    } catch (error) {
                        console.error("Error fetching totalINpipeline:", error);
                    }
                })
            )
               
        }


        asyncOperation().then(() => {

            res.status(200).send({
                success: true,
                data: bloodGroupData,
                message: 'Blood Group Data Fetched',
            });
        }).catch((err) => {
            res.status(400).send({
                success: false,
                message: 'Error in asyncOperation() ',
            });
        })


    } catch (error) {
        return res.status(400).send({
            success: false,
            message: error.message,
        });
    }

})











module.exports = dashboardRouter