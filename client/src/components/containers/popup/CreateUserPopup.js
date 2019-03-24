import React, { Component } from "react";
import { Button, Modal, Container} from "semantic-ui-react";
import CreatePatientPopup from "./CreatePatientPopup";
import CreateStaffPopup from "./CreateStaffPopup";
import { connect } from "react-redux";
import { CreateUserAction } from "actions";
import './CreateUserPopup.css';

export const STATE_CONST = {
  first_name:"First Name",
  last_name:"Last Name",
  email:"Email",
  phone_number:"Phone Number",
  date_of_birth:"Birth Date",
  address:"Address",
  mrn:"MRN Number",
  type_of_injury:"Type of Injury",
  patient_type:"Type of Patient",
  admission_date:"Admission Date",
  discharge_date:"Discharge Date",
  patient_program:"Patient Program",
  patient_category:"Patient Category",
  therapist_type:"Therapist Type",
  permission_level: "Permission Level",
  comment:"Notes",
};


class CreateUserPopup extends Component{
  constructor(props) {
    super(props);
    this.initialState = {
      typeUser:'',
      onNext:false,
    };

    this.state= this.initialState;

    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
  }

  _handleSelectUserClick = (e, { id }) => {
    this.setState({ typeUser: id });
  };

  onNextClick(){
    if(this.state.typeUser !== '') {
      this.setState({onNext: true});
    }
  }

  onPrevClick(){
    this.setState(this.initialState);
  }

  closePopup(){
    this.props.dispatch(CreateUserAction.closePopup())
    this.setState(this.initialState);
  }

  render() {
    const { typeUser, onNext } = this.state;
    const labels = ['Admin', 'Staff', 'Patient'];

    return(
      <Modal size="tiny" className="createUserPopupModal" closeIcon onClose={ () => this.closePopup() } open={ this.props.popup }>
        <Modal.Header>
          {!this.state.onNext ? "New User" : "New " + this.state.typeUser}
        </Modal.Header>
        {!onNext &&
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
        {onNext && typeUser === 'Patient' && <CreatePatientPopup onClose={ () => this.closePopup() } onPrev = {this.onPrevClick}/>}
        {onNext && typeUser !== 'Patient' && <CreateStaffPopup onClose={ () => this.closePopup() } onPrev= {this.onPrevClick} typeUser={this.state.typeUser}/>}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({popup: state.createUser.popup});

export default connect(mapStateToProps)(CreateUserPopup)
