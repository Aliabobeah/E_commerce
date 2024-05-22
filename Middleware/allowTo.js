const allowTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return next(new AppError(403, 'You are not authorized to access this resource'))
        }
        next()
    }
}


module.exports = allowTo;


