import React, { Component } from "react";
import { Button, Modal, Container} from "semantic-ui-react";
import CreatePatientPopup from "./CreatePatientPopup";
import CreateStaffPopup from "./CreateStaffPopup";
import './CreateUserPopup.css';

export const STATE_CONST = {
  userName:"User Name",
  password:"Password",
  firstName:"First Name",
  lastName:"Last Name",
  email:"Email",
  phoneNum:"Phone Number",
  birthDate:"Birth Date",
  address:"Address",
  emergencyContactName:"Name",
  emergencyContactPhoneNum:"Phone Number",
  mrn:"MRN Number",
  typeofInjury:"Type of Injury",
  patientType:"Type of Patient",
  admissionDate:"Admission Date",
  dischargeDate:"Discharge Date",
  patientProgram:"Patient Program",
  patientCategory:"Patient Category",
  permissionLevel:"Permission Level",
  therapistType:"Therapist Type",
  notes:"Notes",
};


export default class CreateUserPopup extends Component{
  constructor(props) {
    super(props);
    this.defaultState = {
      isOpen: true,
      typeUser:'',
      onNext:false,
      slideIndex:1,
    };

    this.state= this.defaultState;

    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
  }

  _handleSelectUserClick = (e, { id }) => {
    this.setState({ typeUser: id });
  };

  onNextClick(){
    if(this.state.typeUser !== '') {
      this.setState({onNext: true, slideIndex: 2});
    }
  }

  onPrevClick(){
    this.setState(this.defaultState);
  }

  static getDerivedStateFromProps(props, state){
    if(props.isOpen !== state.isOpen) {
      return {
        isOpen: true,
        typeUser:'',
        onNext:false,
        slideIndex:1,
      };
    }
    return null;
  }

  render() {
    const { onClose, isOpen } = this.props;
    const { typeUser, onNext, slideIndex } = this.state;
    const labels = ['Admin', 'Staff', 'Patient'];

    return(
      <Modal size="tiny" className="createUserPopupModal" closeIcon onClose={ onClose } open={ isOpen } >
        <Modal.Header>
          {this.state.slideIndex === 1 ? "New User" : "New " + this.state.typeUser}
        </Modal.Header>
        {slideIndex === 1 &&
          <React.Fragment>
            <Modal.Content>
              <Container textAlign='center' className="select-user">
                {labels.map(label=>(
                  <div key={label}>
                    <Button
                      size='big'
                      className="select-btn"
                      toggle active = {this.state.isUserSelected && ({label} === this.typeUser)}
                      onClick={this._handleSelectUserClick}
                      id={label}
                    >
                    {label}
                    </Button>
                  </div>
                ))}
              </Container>
            </Modal.Content>

            <Modal.Actions>
              <Button
                primary
                className="next-btn"
                onClick={this.onNextClick}
              >
              Next
              </Button>
            </Modal.Actions>
          </React.Fragment>
        }

        {onNext && typeUser === 'Patient' && <CreatePatientPopup onClose={ onClose }onPrev = {this.onPrevClick}/>}
        {onNext && typeUser !== 'Patient' && <CreateStaffPopup onClose={ onClose }onPrev= {this.onPrevClick} typeUser={this.state.typeUser}/>}
      </Modal>
    );
  }
}