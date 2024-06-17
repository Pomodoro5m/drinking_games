import PropTypes from 'prop-types';

export function SweetAlert({
    text,
    confirmFunction,
    modalIdentifier = 'sweet-alert',
}) {
    return (
        <dialog id={modalIdentifier} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Atenção!</h3>
                <p className="py-4">{text}</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn btn-success mx-2">Continuar</button>
                        <button onClick={() => { confirmFunction() }} className='btn mx-2 btn-warning'>Sair</button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog >
    )
}

SweetAlert.propTypes = {
    text: PropTypes.string,
    confirmFunction: PropTypes.func,
    modalIdentifier: PropTypes.string,
}