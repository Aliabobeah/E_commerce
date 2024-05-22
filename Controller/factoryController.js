const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");

const getOneDocbyId = (dbModel) => 
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    const query = dbModel.findById(id);
    // 2) Execute query
    const document = await query;
    if (!document) {
      return next(new AppError(`There is no document with this ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });
const getOneDoc = (dbModel,filter) => 
  asyncWrapper(async (req, res, next) => {
    // 1) Build query
    const query = dbModel.findById(filter);
    // 2) Execute query
    const document = await query;
    if (!document) {
      return next(new AppError(`There is no document with this ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

 
 const getAllDocs = (dbModel, filter) => 
    asyncWrapper(async (req, res, next) => {
      // 1) Build query
      const query = dbModel.find(filter);
      // 2) Execute query
      const documents = await query;
      if (!documents) {
        return next(new AppError('There is no documents ', 404));
      }
      res.status(200).json({ data: documents });
    });
  
    const deleteOneDocById = (dbModel) => 
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params || req.body;

    // 1) Build query
    const query = dbModel.findByIdAndDelete(id);
    // 2) Execute query
    const document = await query;
    if (!document) {
      return next(new AppError(`There is no document with this ${id}`, 404));
    }
    res.status(204).json({ message: "document deleted successfully" });
  });

  const createNewAccount = (dbModel) =>
  asyncWrapper(async (req, res, next) => {
    const {
      name,
      email,
       age,
      phoneNumber,
      password,
      gender,
      role,
      image
    } = req.body;
  
    if (!name || !age || !phoneNumber || !email || !password || !gender || !role) {
      return next(new AppError("All fileds are require", 400));
    }
    const isEmailExist = await dbModel.findOne({ email });
    if (isEmailExist) {
      return next(new AppError("Email already exist", 400));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await dbModel.create({ name, email, age, phoneNumber, password: hashPassword, gender, role, image });
    res.status(201).json({ data: newUser });
  })
  const updateOneDocById  = (dbModel, updatedFields, options) =>
  asyncWrapper(async (req, res, next) => {

    const { id } = req.params;
    const query = dbModel.findByIdAndUpdate(id, updatedFields, options);
    const updatedDocument = await query;
    if (!document) {
      return next(new AppError(`There is no document with this ${id}`, 404));
    }
    res.status(200).json({ data: updatedDocument });
  })

  const aggregateQuery = (dbModel, pipeline) =>
  asyncWrapper(async (req, res, next) => {
    const query = dbModel.aggregate(pipeline);
    const result = await query;
    if (!result.length) {
      return next(new AppError('No documents found', 404));
    }
    res.status(200).json({ data: result });
  })
   module.exports = {
    getOneDoc,
    getAllDocs,
    deleteOneDoc,
    updateOneDocById,
    getOneDocbyId,
    aggregateQuery
   }

