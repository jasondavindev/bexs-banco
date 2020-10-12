import { MissingInputFileError } from '../../cli/exception/missing_input_file_error';

export const getInputFile = () => {
  const [filepath] = process.argv.splice(2, 1);
  if (!filepath) throw new MissingInputFileError('Missing input file');
  return filepath;
};
