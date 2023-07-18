import schema from './schema.js'
import InvariantError from '../../exceptions/InvariantError.js'

class CollaborationValidator {
  validate = (data) => {
    const result = schema.validate(data)

    if (result.error) {
      throw new InvariantError(result.error.message)
    }

    return result.value
  }
};

export default CollaborationValidator
