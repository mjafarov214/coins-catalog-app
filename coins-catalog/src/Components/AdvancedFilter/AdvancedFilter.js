import React from 'react';
import 'antd/dist/antd.css';
import './AdvancedFilter.css'
import {
    Form,
    Select,
    InputNumber,
    Row,
    Col
  } from 'antd';

  const { Option } = Select;

class AdvancedFilter extends React.Component{
    state={
        country:[],
        metal:[],
        quality:[]
    }

    componentDidMount(){
        let newCountry=[];
        let  newMetal=[];
        let  newQuality=[];
        this.props.data.forEach(item=>{
            newCountry=[...newCountry,item.country];
            newMetal=[...newMetal,item.metal];
            newQuality=[...newQuality,item.quality];
        })
        let filteredCountry = newCountry.filter(function(elem, pos) {
            return newCountry.indexOf(elem) === pos;
        });

        let filteredMetal = newMetal.filter(function(elem, pos) {
            return newMetal.indexOf(elem) === pos;
        });

        let filteredQuality = newQuality.filter(function(elem, pos) {
            return newQuality.indexOf(elem) === pos;
        });
        this.setState({
            country:filteredCountry,
            metal:filteredMetal,
            quality:filteredQuality
        })
    }

    render(){
        return(
            <Form
                className='advanced-filter fadeIn'
                labelCol={{
                span: 8
                }}
                wrapperCol={{
                span: 22
                }}
                layout="vertical"
                size='large'
                fields={this.props.fields}
                onFieldsChange={(changedFields, allFields) => {
                    this.props.onChange(allFields);
                }}
            >
                <Row>
                    <Col span={14}>
                        <Form.Item name={['coin', 'country']} label="Issuing country">
                            <Select>
                                <Option value='All'>All</Option>
                                {this.state.country
                                .map((item,i)=>(
                                <Option key={i} value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="Price">
                            <span>from</span>
                            <Form.Item name={['coin', 'priceFrom']} noStyle><InputNumber/></Form.Item>
                            <span>to</span>
                            <Form.Item name={['coin', 'priceTo']} noStyle><InputNumber/></Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item name={['coin', 'metal']}  label="Metal">
                            <Select>
                                <Option value='All'>All</Option>
                                {this.state.metal
                                .map((item,i)=>(
                                <Option key={i} value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="Year of issue">
                            <span>from</span>
                            <Form.Item name={['coin', 'yearFrom']} noStyle><InputNumber/></Form.Item>
                            <span>to</span>
                            <Form.Item name={['coin', 'yearTo']} noStyle><InputNumber/></Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14}>
                        <Form.Item name={['coin', 'quality']} label="Quality of the coin">
                            <Select>
                                <Option value='All'>All</Option>
                                {this.state.quality
                                .map((item,i)=>(
                                <Option key={i} value={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default AdvancedFilter;