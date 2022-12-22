import React from 'react';
import Navbar from '../components/Navbar';

const Orders = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='page_content'>
                <h1>Commandes</h1>
                <div className='orders_content'>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Référence</th>
                                <th scope="col">Client</th>
                                <th scope="col">Livraison</th>
                                <th scope="col">Total</th>
                                <th scope="col">Paiement</th>
                                <th scope="col">État</th>
                                <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>022251111</td>
                                <td>Yasmine</td>
                                <td>France</td>
                                <td>991$</td>
                                <td>Stripe</td>
                                <td>Expédié</td>
                                <td>12/11/2022</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;