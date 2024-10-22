import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal } from "@mui/material"


const DeleteDataModel = (props: any) => {
    return (
        <div>
            <Dialog
                open={props.showModel}
                onClose={() => props.toggle(!props.showModel)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Are you Sure?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you Sure You would like to delete ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='success' onClick={() => props.onClick()} >
                        YES
                    </Button>
                    <Button color='error' onClick={() => props.toggle(!props.showModel)}>
                        NO
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default DeleteDataModel