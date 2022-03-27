import './App.css';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import FindSecret from './components/FindSecret';
import { Layout, Menu } from 'antd';
import AddSecret from './components/AddSecret';
const { Header, Content, Footer } = Layout;

function App() {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="App">
      <BrowserRouter>
        <Layout style={{ height: '100%' }}>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Menu theme="dark" mode="horizontal" selectedKeys={activePage.toString()} style={{ justifyContent: 'end' }}>
              <Menu.Item key="1" onClick={() => setActivePage(1)}>
                <Link to={"/"} className="nav-link">Home</Link>
              </Menu.Item>
              <Menu.Item key="2" onClick={() => setActivePage(2)}>
                <Link to={"/add"} className="nav-link">Add Secret</Link>
              </Menu.Item>
              <Menu.Item key="3" onClick={() => setActivePage(3)}>
                <Link to={"/find"} className="nav-link">Find Secret</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="site-layout site-layout-container" md={{ style: { padding: 10 } }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
              <Routes>
                <Route exact path="/" element={< Home handlePageChange={(val) => setActivePage(val)}/>}></Route>
                <Route exact path="/add" element={<AddSecret />}></Route>
                <Route exact path="/find" element={<FindSecret />}></Route>
              </Routes>
            </div>
          </Content>

    <Footer className='footer-container'>Secrets Page ©2022 Created by Michael Adegboro</Footer>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
