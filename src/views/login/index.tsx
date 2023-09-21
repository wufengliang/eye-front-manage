/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2023-07-29 16:20:10
 * @LastEditTime: 2023-09-20 14:10:35
 * @Description:
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { to } from '@/utils/utils';
import { getCheckImgCode, loginIn } from '@/api/login';
import { setCurrentUser } from '@/store/slices/user';
import Cookies from 'js-cookie';
import { USER_TOKEN, USER_INFO } from '@/utils/variable';
import { Storage } from '@/utils/storage';
import { useRequest } from 'ahooks';
import './index.scss';

export default function LoginIndex() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [codeConfig, setCodeConfig] = useState({ image: '', uuid: '', });
  const { loading, run } = useRequest(async (value: Record<string, any>) => {
    const [error, result] = await to(loginIn({ ...value, uuid: codeConfig.uuid }));
    if (error) {
      return getCode();
    }
    const { authToken } = result;
    dispatch(setCurrentUser(result));
    Storage.setItem(USER_INFO, result);
    Cookies.set(USER_TOKEN, authToken);
    navigate('/');
  }, { manual: true });

  useEffect(() => {
    getCode();
  }, [])

  /**
   * @desc 获取图片地址
   */
  const getCode = async () => {
    const [, result] = await to(getCheckImgCode());
    if (result) {
      setCodeConfig(result);
    }
  }

  const renderLeft = () => {
    return (
      <>
        <p className="font-50 text-white">身无彩凤双飞翼</p>
        <p className="font-50 text-white">心有灵犀一点通</p>
        <p className='font-20 text-white margin-top-20 flex items-center justify-center'>
          <i className='iconfont icon-duigou'></i>
          <span className='margin-left-10'>智慧</span>
          <i className='iconfont icon-duigou margin-left-20'></i>
          <span className='margin-left-10'>准确</span>
          <i className='iconfont icon-duigou margin-left-20'></i>
          <span className='margin-left-10'>轻松上手</span>
        </p>
      </>
    )
  }

  const renderRight = () => {
    return (
      <div className='login-wrapper padding-top-50 padding-bottom-50 px-10'>
        <p className='margin-bottom-10'><b className='font-30'>登录您的账号</b></p>
        <p className="font-15 flex items-center margin-bottom-20">
          <span className='text-[#999]'>没有账号？</span>
          <span className='text-[#a19df7]'>
            <a href='javascript' className='margin-left-5 no-underline text-[#a19df7]'>联系合作</a>
            <i className='iconfont icon-goto margin-left-10'></i>
          </span>
        </p>
        {renderLoginBox()}
      </div>
    )
  }

  /**
   * @desc 登录容器
   */
  const renderLoginBox = () => {
    return (
      <>
        <Form
          initialValues={{ phone: '13417103801', password: '123' }}
          onFinish={run}
        >
          <Form.Item
            name='phone'
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input
              className='h-11'
              prefix={<i className='iconfont icon-yonghuming !text-xs margin-right-10 text-[#a8abb2]'></i>}
              placeholder='手机号'
            />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              className='h-11'
              prefix={<i className='iconfont icon-ai-password !text-xs margin-right-10 text-[#a8abb2]'></i>}
              placeholder='密码'
            />
          </Form.Item>
          <Form.Item
            name='code'
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <Input
              className='h-11'
              prefix={<i className='iconfont icon-yanzhengma !text-sm margin-right-10 text-[#a8abb2]' />}
              suffix={
                <img
                  className='w-[100px] h-full'
                  src={codeConfig.image}
                  onClick={() => getCode()}
                  alt='验证码'
                />
              }
              placeholder='验证码'
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              className='w-full h-11 bg-[#9895f5] hover:bg-[#9895f5]'
              type="primary"
              htmlType='submit'
            >登录</Button>
          </Form.Item>
        </Form>
      </>
    )
  }

  return <div className='login-box w-full h-full flex items-center justify-center'>
    <div className='login-box__content max-w-full max-h-full flex justify-between'>
      <div className="login-box__content_left h-full flex items-center justify-center flex-col">{renderLeft()}</div>
      <div className="login-box__content_right flex items-center justify-center">{renderRight()}</div>
    </div>
  </div>
}
