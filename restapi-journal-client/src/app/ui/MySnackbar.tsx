
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

type Props = {
    open: boolean,
    autoHideDuration?: number,
    message: string,
    onClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void,
}

const DEFAULT_AUTO_HIDE_DURATION = 4000; // ms

export default function MySnackbar( { open, autoHideDuration = DEFAULT_AUTO_HIDE_DURATION, 
                                        message, onClose }: Props ) {
    const action = (
        <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={ onClose }
        >
            <CloseIcon fontSize='small' />
        </IconButton>
    );

    return (
        <Snackbar 
            open={ open }
            autoHideDuration={ autoHideDuration }
            message={ message }
            action={ action }
            onClose={ onClose }
        />
    );
}