import React from 'react';
import { Descriptions, Tag } from 'antd';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { SimpleModal } from '../../atoms/modal';
import { Avatar } from '../../atoms/avatar';
import { MemberContext } from '../../../auth/member.context';

const ModalContentCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImage = styled.div`
  margin-Right: 24px;
`;

export default function Profile({ show, onClose }) {
  const member = MemberContext.memberInformation;
  const name = member?.name;
  const typeName = member?.typeName;
  const roles = member?.roles.map((tag) => (
    <Tag color="orange" key={tag}>{tag}</Tag>
  ));
  const permission = member?.permissions.map((tag) => (
    <Tag color="blue" key={tag}>{tag}</Tag>
  ));

  return (
    <SimpleModal title="프로필" open={show} onCancel={onClose}>
      <ModalContentCenter>
        <ProfileImage>
          <Avatar
            ssrc={member.picture}
            size={128}
            />
        </ProfileImage>
        <div>
          <Descriptions
            bordered
            size="small"
            layout="horizontal"
            column={1}
            labelStyle={{ fontWeight: 'bold', width: '100px', textAlign: 'center' }}
            >
            <Descriptions.Item label="유형">{typeName}</Descriptions.Item>
            <Descriptions.Item label="이름">{name}</Descriptions.Item>
            <Descriptions.Item label="역할">{roles}</Descriptions.Item>
            <Descriptions.Item label="권한">{permission}</Descriptions.Item>
          </Descriptions>
        </div>
      </ModalContentCenter>
    </SimpleModal>
  );
}

Profile.propTypes = {
  show: propTypes.bool.isRequired,
  onClose: propTypes.func.isRequired,
};
