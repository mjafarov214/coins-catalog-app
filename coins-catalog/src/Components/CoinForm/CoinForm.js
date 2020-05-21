import React from 'react';
import './CoinForm.css';
import 'antd/dist/antd.css';
import{Redirect} from 'react-router-dom';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Modal,
    Button
  } from 'antd';
  import { ExclamationCircleOutlined } from '@ant-design/icons';


  const validateMessages = {
    required: '${label} is required!',
    types: {
      number: '${label} is not a validate number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

  

class CoinForm extends React.Component{
    state = { 
        visible: false,
        redirect: false
    };

    showModal = () => {
        this.setState({
        visible: true,
        });
    };

    handleOk = e => {
        this.setState({
          visible: false,
          redirect:true
        });
      };
    
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render(){
        if (this.state.redirect) {
            return <Redirect to='/admin'/>;
          }
        return(
            <Form
                className='coin-form stretchLeft'
                labelCol={{
                span: 10
                }}
                wrapperCol={{
                span: 20
                }}
                layout="vertical"
                size='large'
                fields={this.props.fields}
                onFinish={this.props.onFinish}
                validateMessages={validateMessages}
            >
                <table>
                    <tbody>
                        <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'name']} 
                            label="Coin name"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                        <td rowSpan={2}>
                            <Form.Item name={['coinAdd', 'firstPar']} 
                            label="Short description"
                            className='form-description'
                            rowSpan={2}
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input.TextArea rows={7} />
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name={['coinAdd', 'image_src']} 
                            label="Link to obverse image"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'face_value']} 
                            label="Face value"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name={['coinAdd', 'image_src_rever']}
                            label="Link to reverse image"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'year']} 
                            label="Year of issue"
                            className='form-number'
                            rules={[
                                {
                                    required: true,
                                    type: 'number',
                                    min: 0,
                                    max: 2020,
                                },
                            ]}
                            >
                                <InputNumber className='form-number'/>
                            </Form.Item>
                        </td>
                        <td rowSpan={2}>
                            <Form.Item name={['coinAdd', 'secondPar']} 
                            label="Long description"
                            className='form-description'
                            rowSpan={2}
                            >
                                <Input.TextArea rows={7} />
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name={['coinAdd', 'typeCoin']} 
                            label="Type of the coin"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Select>
                                    <Select.Option value="bullion">Bullion coin</Select.Option>
                                    <Select.Option value="exclusive">Exclusive coin</Select.Option>
                                    <Select.Option value="commemorative">Commemorative coin</Select.Option>
                                </Select>
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'price']} 
                            label="Price"
                            rules={[
                                {
                                required: true,
                                type: 'number',
                                min:0,
                                max: Infinity,
                                },
                            ]}
                            >
                                <InputNumber className='form-number'
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'country']} 
                            label="Country"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name={['coinAdd', 'quality']} 
                            label="Quality of the coin"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Form.Item name={['coinAdd', 'metal']} 
                            label="Metal"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                                <Input/>
                            </Form.Item>
                        </td>
                        <td>
                            <Form.Item name={['coinAdd', 'weight']} 
                            label="Weight"
                            rules={[
                                {
                                required: true,
                                type: 'number',
                                min:0,
                                max: Infinity,
                                },
                            ]}
                            >
                                <InputNumber className='form-number'/>
                            </Form.Item>
                        </td>
                        <td>
                        <Button className='form-button' type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button className='admin-home-button' onClick={this.showModal}>
                            Cancel
                        </Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    >
                    <h3>{<ExclamationCircleOutlined className='form-modal-icon'/>}  
                        Are you sure to cancel?
                    </h3>
                </Modal>
            </Form>
        );
    }
}

export default CoinForm;