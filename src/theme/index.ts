import { makeStyles } from '@material-ui/styles';
import { Theme } from '../types/theme.type';

const useStyles = makeStyles((theme: Theme) => ({
  borderRadius: {
    borderRadius: theme.borderRadius,
  },
}));

export default useStyles;
