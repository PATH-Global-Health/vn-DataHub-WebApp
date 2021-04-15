import React, { useMemo } from 'react';

import {
  Grid,
  Segment,
  Header,
  Card,
  Icon,
  Dimmer,
  Loader,
  // Image,
  // Reveal,
} from 'semantic-ui-react';

import { useFetchApi, useSelector, useDispatch } from '@app/hooks';
import SimpleForm, { Location } from '@app/components/simple-form';
import { FormField } from '@app/models/form-field';

import userService from '@admin/user-management/user/user.service';
import { UserInfo } from '@app/models/user-info';
import { getUserInfo } from '@app/slices/auth';

// import activeLogo from '@app/assets/img/logo.png';
// import hiddenLogo from '@app/assets/img/hidden-logo.png';

interface FormModel extends UserInfo {
  location?: Location;
}

const ProfilePage: React.FC = () => {
  const { userInfo: ui, getUserInfoLoading: loading } = useSelector(
    (s) => s.auth,
  );
  const formFields = useMemo(
    (): FormField<FormModel>[] => [
      { name: 'name', label: 'Tên đơn vị' },
      { name: 'address', label: 'Địa chỉ' },
      {
        name: 'location',
        type: 'location',
        locationData: {
          districtCode: ui?.district ?? '',
          provinceCode: ui?.province ?? '',
          wardCode: ui?.ward ?? '',
        },
      },
      { name: 'website', label: 'Website' },
      { name: 'phone', label: 'Số điện thoại' },
      { name: 'email', label: 'Email' },
      { name: 'introduction', label: 'Giới thiệu', type: 'textarea' },
    ],
    [ui],
  );
  const { fetch, fetching } = useFetchApi();

  const loadingSection = useMemo(
    () => (
      <Dimmer active inverted>
        <Loader inverted content="Loading" />
      </Dimmer>
    ),
    [],
  );
  const dispatch = useDispatch();
  // const fileRef = useRef<HTMLInputElement>(null);
  // const [selectedFile, setSelectedFile] = useState<File>();
  // const handleClick = () => {
  //   if (fileRef.current !== null) {
  //     fileRef.current.click();
  //   }
  // };
  // useEffect(() => {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append('file', selectedFile);
  //     fetch(userService.updateLogo(formData)).then(() => {
  //       dispatch(getUserInfo());
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [fetch, selectedFile]);

  return (
    <Grid columns={2} stackable className="fill-content">
      <Grid.Row stretched>
        <Grid.Column width={8}>
          <Segment>
            <Header as="h1">Cá nhân</Header>
            {loading ? (
              loadingSection
            ) : (
              <>
                {/* <Reveal animated="rotate">
                  <Reveal.Content visible>
                    <Image circular size="small" src={activeLogo} />
                  </Reveal.Content>
                  <Reveal.Content hidden>
                    <Image
                      style={{ padding: '20px' }}
                      circular
                      size="small"
                      src={hiddenLogo}
                      onClick={handleClick}
                    />
                    <input
                      hidden
                      id="selectImage"
                      type="file"
                      accept="image/*"
                      ref={fileRef}
                      onChange={(e) => {
                        if (e.target !== null && e.target.files !== null) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Reveal.Content>
                </Reveal> */}
                <Card fluid>
                  <Card.Content extra>
                    <Card.Header>{ui?.name}</Card.Header>
                    <Card.Meta>{ui?.address}</Card.Meta>
                    <Card.Description>{ui?.introduction}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name="phone" />
                    {ui?.phone}
                  </Card.Content>
                  <Card.Content extra>
                    <Icon name="envelope outline" />
                    {ui?.email}
                  </Card.Content>
                </Card>
              </>
            )}
          </Segment>
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment>
            <Header as="h2">Chỉnh sửa thông tin</Header>
            {loading ? (
              loadingSection
            ) : (
              <SimpleForm
                defaultValues={ui || undefined}
                formFields={formFields}
                loading={fetching}
                onSubmit={async (d): Promise<void> => {
                  await fetch(
                    userService.updateInfo({
                      ...d,
                      province: d.location?.provinceCode ?? '',
                      district: d.location?.districtCode ?? '',
                      ward: d.location?.wardCode ?? '',
                    }),
                  );
                  dispatch(getUserInfo());
                }}
              />
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default ProfilePage;
