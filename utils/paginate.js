
const paginate = async (model, query = {}, reqQuery = {}, options = {}) => {
    const {page = 1, limit = 5, sort = "-createdAt"} = reqQuery;

    const paginationOptions = {
        page: parseInt(page), 
        limit: parseInt(limit),
        sort,
        ...options
    };

    try{
        const result = await model.paginate(query, paginationOptions);
        return {
            data: result.docs,
            currentPage: result.page,
            nextPage: result.nextPage,
            prevPage: result.prevPage,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
            totalDocs: result.totalDocs,
            totalPages:  result.totalPages,
            limit: result.limit,
            counter: result.pagingCounter
        }
    }
    catch(error){
        next(error);
    }
}

export default paginate;