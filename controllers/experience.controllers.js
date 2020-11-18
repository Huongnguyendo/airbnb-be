const Experience = require("../models/Experience");
const Review = require("../models/Review");
const {
    AppError,
    catchAsync,
    sendResponse,
  } = require("../helpers/utils.helper");
const experienceController = {};

/*
    res.json eventually calls res.send, but before that it:
    respects the json spaces and json replacer app settings
    ensures the response will have utf8 charset and application/json content-type 
*/

experienceController.getExp = catchAsync(async (req, res, next) => {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 25;

    // const filteredList = await Experience.find({minimumRate: { $gt: min, $lt: max }}); 
  
    const totalExp = await Experience.countDocuments({
      ...filter,
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalExp / limit);
    console.log("page ne: ", totalPages);
    const offset = limit * (page - 1);
  
    // console.log("filter: ". filter);
    // if filter manually, filter experience deleted false right here
    const exps = await Experience.find(filter)
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      // .populate("User")
      .populate("author");
  
    return sendResponse(res, 200, true, {  exps, totalPages }, null, "");
  }); 


experienceController.createExp = async (req, res) => {
    const author = req.userId;
    // get info from req.body, create Exp then return res
    const { title, pictureUrl, country, description, minimumRate, duration } = req.body;
    console.log("author ne", author);
    const exp = await Experience.create({
        author,
        title,
        pictureUrl,
        country,
        
        description,
        minimumRate,
        duration,
    })
    res.json({
        success: true,
        data: exp,
        message: "sucesss!"
    })
    //  save 
    await exp.save();
    
}

experienceController.getSingleExp = catchAsync(async (req, res, next) => {
  // populate where you need, no need to populate from getExp
    let exp = await Experience.findById(req.params.id).populate("author");
    if (!exp)
      return next(new AppError(404, "Exp not found", "Get Single Exp Error"));
    exp = exp.toJSON();
    exp.reviews = await Review.find({ exp: exp._id }).populate("author").populate("user");
    return sendResponse(res, 200, true, exp, null, null);
  });

experienceController.updateSingleExp = catchAsync(async (req, res, next) => {
    const author = req.userId;
    const expId = req.params.id;
    console.log("req.params ne: ", req.params);
    console.log("hehe: ", author, expId);
    // city, group size, language, description, host details, what to bring in req.body
    const { title, description, pictureUrl, country, city, groupsize, minimumRate, duration} = req.body;
  
    const exp = await Experience.findOneAndUpdate(
      { _id: expId, author: author },
        // city, group size, language, description, host details, what to bring in req.body
      { title, description, pictureUrl, country, city, groupsize, minimumRate, duration },
      { new: true }
    );
    if (!exp)
      return next(
        new AppError(
          400,
          "Experience not found or User not authorized",
          "Update Experience Error"
        )
      );
    // await exp.save();
    return sendResponse(res, 200, true, exp, null, "Update Experience successful");
  });
  
experienceController.deleteSingleExp = catchAsync(async (req, res, next) => {
    const author = req.userId;
    const expId = req.params.id;
  
    const exp = await Experience.findOneAndUpdate(
      { _id: expId, author: author },
      { isDeleted: true },
      { new: true }
    );
    if (!exp)
      return next(
        new AppError(
          400,
          "Experience not found or User not authorized",
          "Delete Experience Error"
        )
      );
    // await exp.save();
    return sendResponse(res, 200, true, null, null, "Delete Experience successful");
  });
  
  
module.exports = experienceController;