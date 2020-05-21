import React from 'react';
import './CoinAbout.css';
import { Typography } from 'antd';

const { Text } = Typography;

class CoinAbout extends React.Component{
    state={
        data:{}
    }
    componentDidMount(){
        this.getData();
    }
    getData=()=>{
        fetch(`http://localhost:3002/coin/${this.props.match.params.ID}`)
        .then(res=>res.json())
        .then(data=>this.setState({data:data[0]}))
    }

    render(){
        const{country , face_value , image_src , image_src_rever , name
        , metal , firstPar , price , quality , secondPar , weight , year} = this.state.data;
        return(
            <div className='coin-about'>
                <div className='coin-about-img'>
                    <img src={image_src} alt='coin'/>
                    <img src={image_src_rever} className='coin-about-img-rever' alt='coin'/>
                </div>
                <div className='coin-about-info'>
                    <div className='coin-about-info-text'>
                        <h2>{name}</h2>
                        <p className='coin-info-text'>{firstPar}</p>
                        <p className='coin-info-text'>{secondPar}</p>
                    </div>
                    <table className="coin-about-table">
                        <tbody>
                            <tr>
                                <td>Issuing country</td>
                                <td>{country}</td>
                            </tr>
                            <tr>
                                <td>Composition</td>
                                <td>{metal}</td>
                            </tr>
                            <tr>
                                <td>Quality</td>
                                <td>{quality}</td>
                            </tr>
                            <tr>
                                <td>Denomination</td>
                                <td>{face_value}</td>
                            </tr>
                            <tr>
                                <td>Year</td>
                                <td>{year}</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>{weight} g</td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td>{price} $</td>
                            </tr>
                        </tbody>
                    </table>
                    <Text underline className='about-back' onClick={()=>this.props.history.goBack()}>Back to the List</Text>
                </div>
            </div>
        );
    }
}

export default CoinAbout;