import React from 'react';

const Alert = (props) => (
    <div id="Alert">
        <main className={props.type}>
            <p>
                <i className="fas fa-chevron-left"></i> {props.message} <i className="fas fa-chevron-right"></i>
            </p>
        </main>
    </div>
);

export default Alert;