import React from 'react';
import './CoinsListItem.css'
import{Link} from 'react-router-dom';

class CoinsListItem extends React.Component{
    render(){
        const {ID,image_src,name,firstPar,image_src_rever} = this.props.data
        return(
            <div className='coins-list-item'>
                <div className='coins-item-img'>
                    <img src={image_src} alt="coin"/>
                    <img src={image_src_rever} className='coins-item-img-rever' alt='coin'/>
                </div>
                <div className='coins-item-info'>
                    <Link className='coins-item-link' data={ID} to={`/coin/info/${ID}`}>{name}</Link>
                    <p>{firstPar}</p>
                </div>
            </div>
        );
    }
}

export default CoinsListItem;