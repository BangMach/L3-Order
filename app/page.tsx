"use client";

import './page.css';

import { Button, Card, Checkbox, Col, Form, Input, InputNumber, Layout, List, Menu, Modal, Radio, RadioChangeEvent, Row, Select, theme } from 'antd';
import { GetServerSideProps, NextPage } from 'next';

import Food from "./pages/food"
import prisma from '../lib/prisma';
import { useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;

type Drink = {
  id: string;
  name: string;
};

type PageProps = {
  drink: Drink[];
};
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const drink = await prisma?.drink.findMany({
    select: {
      id: true,
      name: true
    }
  })
  return {
    props: { drink },
    revalidate: 10
  }
}

const Page: NextPage<PageProps> = ({ drink }) => {

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleClick = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const [typeValue, setTypeValue] = useState('');

  const handleTypeChange = (e: RadioChangeEvent) => {
    setTypeValue(e.target.value);
  }
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm()
  const coffeeList = [
    { id: 1, name: ' Milk Coffee' },
    { id: 2, name: ' Milk Coffee' },
    { id: 3, name: ' Milk Coffee' },
  ];

  const renderCoffeeItem = (item: { id: number, name: string }) => (
    <div>
      <h3>{item.name}:</h3>
      <p>Size: L</p>
      <p>Type: Cold</p>
      <p>Whipped Cream: Yes</p>
      <p>Milk: Whole Milk</p>
    </div>
  );
  return (
    <>
      <Layout style={{ minHeight: '90vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" style={{
            height: "32px",
            margin: "16px",
            fontSize: "150%",
            fontWeight: "bolder",
            color: "White",
            textAlign: "center",
          }}>Menu</div>
          <Menu theme='dark'
            mode="inline"
            style={{ paddingTop: "30%" }}
            defaultSelectedKeys={['1']}
            items={[
              {
                key: 'drinks',
                label: 'Drinks/ Thức Uống',
                // onClick: onClick
              },
              {
                key: 'breakfast',
                label: 'Breakfast/ Bữa Sáng',
                // onClick: onClick

              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ background: colorBgContainer, textAlign: "center", paddingBottom: "6%" }}> <h1 style={{ fontSize: "150%", }}>Coffee Shop Name</h1></Header>
          <Content style={{ margin: '24px 16px 0', display: "flex" }}>
            <Content style={{ flex: 0.7, marginRight: '10px' }}>
              <Row gutter={[16, 16]}>
                {drink?.map((item) => (
                  <Col key={item.id} span={8}>
                    <Card
                      className="coffeeCard"
                      title={item.name}
                      cover={
                        <img
                          className="coffeeImg"
                          alt="coffee"
                          src="https://product.hstatic.net/1000287491/product/4._ca_phe_sua_da.jpg"
                        />
                      }
                    >
                      <Button className="addBtn" type="primary" onClick={handleClick}>
                        Add to Order
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Content>
            <Content className='order'>
              <h1 >Order</h1>
              <div className='coffeeList'>
                <List
                  dataSource={coffeeList}
                  renderItem={(item) => renderCoffeeItem(item)}
                  pagination={false}
                />
                <h2>Total Price: 20$</h2>
              </div>

              <Button className='payBtn' type="primary">
                Pay/ Thanh Toán
              </Button>
            </Content>
          </Content>

          <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>

      </Layout>
      <Modal
        title="Customize coffee"
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" form="planForm">
            Add to order
          </Button>
        ]}
      >
        <div style={{ display: 'flex', height: '100%', marginTop: '5%' }}>
          <Form form={form}
            id="coffeeForm"
            labelCol={{ span: 13 }}
            wrapperCol={{ span: 11 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            labelAlign="left"
          >
            <Form.Item
              label="Amount/Số Lượng"
              name="amount"
            >
              <InputNumber min={1} defaultValue={1} />
            </Form.Item>
            <Form.Item
              label="Type/Loại"
              name="type"
              rules={[{ required: true, message: 'Please input plan name !' }]}
            >
              <Radio.Group onChange={handleTypeChange}>
                <Radio value="Hot"> Hot/Nóng </Radio>
                <Radio value="Cold"> Cold/Lạnh </Radio>
                <Radio value="Blended"> Blended/Đá Xay </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Size"
              name="size"
              rules={[{ required: true, message: 'Please input plan name !' }]}
            >
              <Radio.Group value={typeValue === 'Hot' ? 'S' : undefined}>
                <Radio value="S">S</Radio>
                <Radio value="M">M</Radio>
                <Radio value="L" disabled={typeValue === 'Hot'}>
                  L
                </Radio>
                <Radio value="XL" disabled={typeValue === 'Hot'}>
                  XL
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Whipped Cream"
              name="Whipped"
              rules={[{ required: true, message: 'Please input plan name !' }]}
            >
              <Radio.Group>
                <Radio value="yes"> Yes </Radio>
                <Radio value="no"> No </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Milk"
              name="milk"
              rules={[{ required: true, message: 'Please input plan name !' }]}
            >
              <Radio.Group>
                <Radio value="yes"> Whole Milk </Radio>
                <Radio value="no"> Almond Milk </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Chocolate Sauce"
              name="Chocolate"
            >
              <InputNumber min={0} max={6} disabled={(typeValue == "Cold") || (typeValue == "Blended")} />
            </Form.Item>
          </Form >
        </div >
      </Modal>
    </>

  );
};

export default Page;
