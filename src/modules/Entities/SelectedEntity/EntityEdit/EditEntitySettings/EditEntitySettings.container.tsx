import React, { Dispatch } from 'react'
import { connect } from 'react-redux'
import EditEntityBase, {
  EditEntityBaseProps,
} from '../components/EditEntityBase/EditEntityBase'
import { RootState } from 'common/redux/types'
import {
  addDisplayCredentialSection,
  addRequiredCredentialSection,
  removeDisplayCredentialSection,
  removeRequiredCredentialSection,
  updateCreator,
  updateDisplayCredential,
  updateFilters,
  updateOwner,
  updatePrivacy,
  updateRequiredCredential,
  validated,
  validationError,
  updateTermsOfUse,
  updateVersion,
  updateHeadlineMetric,
  addAnalyticsSection,
  updateAnalyticsContent,
  removeAnalyticsSection,
} from './EditEntitySettings.actions'
import { goToStep } from '../EditEntity.actions'
import * as editEntitySelectors from '../EditEntity.selectors'
import * as entitySettingsSelectors from './EditEntitySettings.selectors'
import { FormData } from 'common/components/JsonForm/types'
import {
  Owner,
  Creator,
  Status,
  Privacy,
  RequiredCredential,
  DisplayCredential,
  Version,
  TermsOfUse,
} from './types'
import FormCardWrapper from 'common/components/Wrappers/FormCardWrapper/FormCardWrapper'
import { EmbeddedPageContent } from 'modules/Entities/SelectedEntity/EntityEdit/EditEntityPageContent/types'
import OwnerCard from '../../../CreateEntity/CreateEntitySettings/components/OwnerCard/OwnerCard'
import CreatorCard from '../../../CreateEntity/CreateEntitySettings/components/CreatorCard/CreatorCard'
// import TermsOfUseCard from '../../../CreateEntity/CreateEntitySettings/components/TermsOfUseCard/TermsOfUseCard'
import VersionCard from '../../../CreateEntity/CreateEntitySettings/components/VersionCard/VersionCard'
// import PrivacyCard from '../../../CreateEntity/CreateEntitySettings/components/PrivacyCard/PrivacyCard'
// import RequiredCredentialCard from '../../../CreateEntity/CreateEntitySettings/components/RequiredCredentialCard/RequiredCredentialCard'
import DisplayCredentialCard from '../../../CreateEntity/CreateEntitySettings/components/DisplayCredentialCard/DisplayCredentialCard'
import FilterCard from '../../../CreateEntity/CreateEntitySettings/components/FilterCard/FilterCard'
import HeadlineMetricCard from '../../../CreateEntity/CreateEntitySettings/components/HeadlineMetricCard/HeadlineMetricCard'
import * as entityClaimsSelectors from '../EditEntityClaims/EditEntityClaims.selectors'
import { EntityClaimItem } from '../EditEntityClaims/types'
import EmbeddedAnalyticsCard from '../../../CreateEntity/CreateEntitySettings/components/EmbeddedAnalyticsCard/EmbeddedAnalyticsCard'
import { EntityType, EntityTypeStrategyMap } from 'modules/Entities/types'
import { selectEntityConfig } from 'modules/Entities/EntitiesExplorer/EntitiesExplorer.selectors'

interface Props extends EditEntityBaseProps {
  owner: Owner
  creator: Creator
  status: Status
  version: Version
  termsOfUse: TermsOfUse
  privacy: Privacy
  headlineTemplateId: string
  requiredCredentials: RequiredCredential[]
  filters: { [name: string]: string[] }
  displayCredentials: DisplayCredential[]
  entityClaims: EntityClaimItem[]
  embeddedAnalytics: EmbeddedPageContent[]
  entityConfig: EntityTypeStrategyMap
  handleAddDisplayCredentialSection: () => void
  handleAddFilterSection: () => void
  handleAddRequiredCredentialSection: () => void
  handleRemoveDisplayCredentialSection: (id: string) => void
  handlerRemoveFilterSection: (id: string) => void
  handleRemoveRequiredCredentialSection: (id: string) => void
  handleUpdateCreator: (formData: FormData) => void
  handleUpdateDisplayCredential: (id: string, formData: FormData) => void
  handleUpdateFilters: (formData: FormData) => void
  handleUpdateOwner: (formData: FormData) => void
  handleUpdatePrivacy: (formData: FormData) => void
  handleUpdateTermsOfUse: (formData: FormData) => void
  handleUpdateVersion: (formData: FormData) => void
  handleUpdateRequiredCredential: (id: string, formData: FormData) => void
  handleUpdateHeadlineMetric: (formData: FormData) => void
  handleAddAnalyticsSection: () => void
  handleUpdateAnalyticsContent: (id: string, formData: FormData) => void
  handleRemoveAnalyticsSection: (id: string) => void
}

class EditEntitySettings extends EditEntityBase<Props> {
  renderCreator = (): JSX.Element => {
    this.cardRefs['creator'] = React.createRef()

    const {
      creator: {
        displayName,
        location,
        email,
        website,
        mission,
        creatorId,
        credential,
        fileSrc,
        uploading,
      },
      entityType,
      entityConfig,
      handleUpdateCreator,
    } = this.props

    return (
      <FormCardWrapper
        showAddSection={false}
        title={`${entityConfig![entityType].title} Creator`}
      >
        <CreatorCard
          ref={this.cardRefs['creator']}
          displayName={displayName}
          location={location}
          email={email}
          website={website}
          mission={mission}
          creatorId={creatorId}
          credential={credential}
          fileSrc={fileSrc}
          uploadingImage={uploading}
          handleUpdateContent={handleUpdateCreator}
          handleSubmitted={(): void => this.props.handleValidated('creator')}
          handleError={(errors): void =>
            this.props.handleValidationError('creator', errors)
          }
        />
      </FormCardWrapper>
    )
  }

  renderOwner = (): JSX.Element => {
    this.cardRefs['owner'] = React.createRef()

    const {
      owner: {
        displayName,
        location,
        email,
        website,
        mission,
        ownerId,
        fileSrc,
        uploading,
      },
      entityType,
      entityConfig,
      creator,
      handleUpdateOwner,
    } = this.props

    return (
      <FormCardWrapper
        showAddSection={false}
        title={`${entityConfig![entityType].title} Owner`}
        keyword="owner"
      >
        <OwnerCard
          ref={this.cardRefs['owner']}
          displayName={displayName}
          location={location}
          email={email}
          website={website}
          mission={mission}
          ownerId={ownerId}
          fileSrc={fileSrc}
          uploadingImage={uploading}
          entityType={entityType}
          handleUpdateContent={handleUpdateOwner}
          handleSubmitted={(): void => this.props.handleValidated('owner')}
          handleError={(errors): void =>
            this.props.handleValidationError('owner', errors)
          }
          handleCopyFromOwner={(): void =>
            handleUpdateOwner({
              ...creator,
              ownerId: creator.creatorId,
            })
          }
        />
      </FormCardWrapper>
    )
  }

  renderVersion = (): JSX.Element => {
    this.cardRefs['version'] = React.createRef()

    const {
      version: { versionNumber, effectiveDate, notes },
      entityConfig,
      entityType,
      handleUpdateVersion,
    } = this.props

    return (
      <FormCardWrapper
        showAddSection={false}
        title={`${entityConfig![entityType].title} Version`}
      >
        <VersionCard
          ref={this.cardRefs['version']}
          versionNumber={versionNumber}
          effectiveDate={effectiveDate}
          notes={notes}
          handleUpdateContent={handleUpdateVersion}
          handleSubmitted={(): void => this.props.handleValidated('version')}
          handleError={(errors): void =>
            this.props.handleValidationError('version', errors)
          }
        />
      </FormCardWrapper>
    )
  }

  renderHeadlineMetric = (): JSX.Element => {
    this.cardRefs['headline'] = React.createRef()
    const {
      headlineTemplateId,
      entityClaims,
      handleUpdateHeadlineMetric,
    } = this.props

    let description =
      'Choose a Claim or other Data Source to display in the Explorer Card for this entity'

    if (headlineTemplateId) {
      const selectedTemplate = entityClaims.find(
        (claim) => claim.template.templateId === headlineTemplateId,
      )
      if (selectedTemplate) {
        description = selectedTemplate.template.description
      }
    }

    return (
      <FormCardWrapper
        showAddSection={false}
        title="Headline Metric"
        description={description}
        keyword="headlineMetric"
      >
        <HeadlineMetricCard
          headlineTemplateId={headlineTemplateId}
          entityClaims={entityClaims}
          ref={this.cardRefs['headline']}
          handleUpdateContent={handleUpdateHeadlineMetric}
          handleSubmitted={(): void => this.props.handleValidated('headline')}
          handleError={(errors): void =>
            this.props.handleValidationError('headline', errors)
          }
        />
      </FormCardWrapper>
    )
  }

  // renderTermsOfUse = (): JSX.Element => {
  //   this.cardRefs['termsofuse'] = React.createRef()

  //   const {
  //     termsOfUse: { type, paymentTemplateId },
  //     entityConfig,
  //     entityType,
  //     handleUpdateTermsOfUse,
  //   } = this.props

  //   return (
  //     <FormCardWrapper
  //       showAddSection={false}
  //       title={`${entityConfig![entityType].title} Terms of Use`}
  //     >
  //       <TermsOfUseCard
  //         ref={this.cardRefs['termsofuse']}
  //         type={type}
  //         paymentTemplateId={paymentTemplateId}
  //         handleUpdateContent={handleUpdateTermsOfUse}
  //         handleSubmitted={(): void => this.props.handleValidated('termsofuse')}
  //         handleError={(errors): void =>
  //           this.props.handleValidationError('termsofuse', errors)
  //         }
  //       />
  //     </FormCardWrapper>
  //   )
  // }

  // renderPrivacy = (): JSX.Element => {
  //   this.cardRefs['privacy'] = React.createRef()

  //   const {
  //     privacy: { entityView, pageView },
  //     entityConfig,
  //     entityType,
  //     handleUpdatePrivacy,
  //   } = this.props

  //   return (
  //     <FormCardWrapper
  //       showAddSection={false}
  //       title={`${entityConfig![entityType].title} Privacy Settings`}
  //     >
  //       <PrivacyCard
  //         ref={this.cardRefs['privacy']}
  //         pageView={pageView}
  //         entityView={entityView}
  //         handleUpdateContent={handleUpdatePrivacy}
  //         handleSubmitted={(): void => this.props.handleValidated('privacy')}
  //         handleError={(errors): void =>
  //           this.props.handleValidationError('privacy', errors)
  //         }
  //       />
  //     </FormCardWrapper>
  //   )
  // }

  // renderRequiredCredentials = (): JSX.Element => {
  //   const {
  //     requiredCredentials,
  //     handleUpdateRequiredCredential,
  //     handleAddRequiredCredentialSection,
  //     handleRemoveRequiredCredentialSection,
  //   } = this.props

  //   return (
  //     <FormCardWrapper
  //       showAddSection={true}
  //       title="Required Privacy Credentials"
  //       addSectionText="Add Credential"
  //       onAddSection={handleAddRequiredCredentialSection}
  //     >
  //       {requiredCredentials.map((requiredCredential) => {
  //         this.cardRefs[requiredCredential.id] = React.createRef()

  //         const { id, credential, issuer } = requiredCredential

  //         return (
  //           <RequiredCredentialCard
  //             ref={this.cardRefs[requiredCredential.id]}
  //             key={id}
  //             credential={credential}
  //             issuer={issuer}
  //             handleUpdateContent={(formData): void =>
  //               handleUpdateRequiredCredential(id, formData)
  //             }
  //             handleRemoveSection={(): void =>
  //               handleRemoveRequiredCredentialSection(id)
  //             }
  //             handleSubmitted={(): void =>
  //               this.props.handleValidated(requiredCredential.id)
  //             }
  //             handleError={(errors): void =>
  //               this.props.handleValidationError(requiredCredential.id, errors)
  //             }
  //           />
  //         )
  //       })}
  //     </FormCardWrapper>
  //   )
  // }

  renderFilters = (): JSX.Element => {
    this.cardRefs['filter'] = React.createRef()

    const {
      entityConfig,
      entityType,
      filters,
      handleUpdateFilters,
    } = this.props

    return (
      <FormCardWrapper
        showAddSection={false}
        title={`${entityConfig![entityType].title} Filters`}
        description="Use Ctrl (Windows) or Cmd (Mac) to select and deselect the filter tags"
        keyword="ddoTags"
      >
        <FilterCard
          ref={this.cardRefs['filter']}
          entityType={entityType}
          filters={filters}
          handleUpdateContent={handleUpdateFilters}
          handleSubmitted={(): void => this.props.handleValidated('filter')}
          handleError={(errors): void =>
            this.props.handleValidationError('filter', errors)
          }
        />
      </FormCardWrapper>
    )
  }

  renderEmbeddedAnalytics = (): JSX.Element => {
    const {
      embeddedAnalytics,
      handleAddAnalyticsSection,
      handleUpdateAnalyticsContent,
      handleRemoveAnalyticsSection,
    } = this.props

    return (
      <FormCardWrapper
        title="Embedded Analytics"
        description={null}
        showAddSection
        onAddSection={handleAddAnalyticsSection}
        keyword="embeddedAnalytics"
      >
        {embeddedAnalytics.map((section) => {
          this.cardRefs[section.id] = React.createRef()

          const { id, title, urls } = section

          return (
            <EmbeddedAnalyticsCard
              ref={this.cardRefs[section.id]}
              key={id}
              title={title}
              urls={urls}
              handleUpdateContent={(formData): void =>
                handleUpdateAnalyticsContent(id, formData)
              }
              handleRemoveSection={(): void => handleRemoveAnalyticsSection(id)}
              handleSubmitted={(): void =>
                this.props.handleValidated(section.id)
              }
              handleError={(errors): void =>
                this.props.handleValidationError(section.id, errors)
              }
            />
          )
        })}
      </FormCardWrapper>
    )
  }

  renderDisplayCredentials = (): JSX.Element => {
    const {
      displayCredentials,
      handleUpdateDisplayCredential,
      handleAddDisplayCredentialSection,
      handleRemoveDisplayCredentialSection,
    } = this.props

    return (
      <FormCardWrapper
        showAddSection={displayCredentials.length < 3}
        title="Display Credentials"
        addSectionText="Add Credential"
        onAddSection={handleAddDisplayCredentialSection}
        keyword="displayCredentials"
      >
        {displayCredentials.map((displayCredential) => {
          this.cardRefs[displayCredential.id] = React.createRef()

          const { id, credential, badge } = displayCredential

          return (
            <DisplayCredentialCard
              ref={this.cardRefs[displayCredential.id]}
              key={id}
              credential={credential}
              badge={badge}
              handleUpdateContent={(formData): void =>
                handleUpdateDisplayCredential(id, formData)
              }
              handleRemoveSection={(): void =>
                handleRemoveDisplayCredentialSection(id)
              }
              handleSubmitted={(): void =>
                this.props.handleValidated(displayCredential.id)
              }
              handleError={(errors): void =>
                this.props.handleValidationError(displayCredential.id, errors)
              }
            />
          )
        })}
      </FormCardWrapper>
    )
  }

  onSubmitted = (): void => {
    const { entityType, step, handleGoToStep } = this.props

    handleGoToStep(this.getNextStep(entityType, step))
  }

  onBack = (): void => {
    const { entityType, step, handleGoToStep } = this.props

    handleGoToStep(this.getPreviousStep(entityType, step))
  }

  render(): JSX.Element {
    const { displayCredentials, entityType } = this.props
    const identifiers: string[] = []

    identifiers.push('owner')
    identifiers.push('creator')
    identifiers.push('version')
    // identifiers.push('termsofuse')
    // identifiers.push('privacy')
    identifiers.push('filter')

    if (entityType !== EntityType.Template) {
      identifiers.push('headline')
    }

    // requiredCredentials.forEach((section) => {
    //   identifiers.push(section.id)
    // })
    displayCredentials.forEach((section) => {
      identifiers.push(section.id)
    })

    return (
      <>
        {this.renderCreator()}
        {this.renderOwner()}
        {entityType !== EntityType.Template && this.renderHeadlineMetric()}
        {this.renderVersion()}
        {/* {this.renderTermsOfUse()}
        {this.renderPrivacy()} */}
        {/* {this.renderRequiredCredentials()} */}
        {this.renderFilters()}
        {this.renderDisplayCredentials()}
        {this.renderEmbeddedAnalytics()}
        {this.renderButtonGroup(identifiers, true)}
      </>
    )
  }
}

const mapStateToProps = (state: RootState): any => ({
  step: editEntitySelectors.selectStep(state),
  entityType: editEntitySelectors.selectEntityType(state),
  entityConfig: selectEntityConfig(state),
  owner: entitySettingsSelectors.selectOwner(state),
  creator: entitySettingsSelectors.selectCreator(state),
  status: entitySettingsSelectors.selectStatus(state),
  version: entitySettingsSelectors.selectVersion(state),
  termsOfUse: entitySettingsSelectors.selectTermsOfUse(state),
  privacy: entitySettingsSelectors.selectPrivacy(state),
  requiredCredentials: entitySettingsSelectors.selectRequiredCredentials(state),
  filters: entitySettingsSelectors.selectFilters(state),
  displayCredentials: entitySettingsSelectors.selectDisplayCredentials(state),
  validationComplete: entitySettingsSelectors.selectValidationComplete(state),
  validated: entitySettingsSelectors.selectValidated(state),
  entityClaims: entityClaimsSelectors.selectEntityClaims(state),
  headlineTemplateId: entitySettingsSelectors.selectHeadlineTemplateId(state),
  embeddedAnalytics: entitySettingsSelectors.selectEmbeddedAnalytics(state),
})

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  handleAddDisplayCredentialSection: (): void =>
    dispatch(addDisplayCredentialSection()),
  handleAddRequiredCredentialSection: (): void =>
    dispatch(addRequiredCredentialSection()),
  handleRemoveDisplayCredentialSection: (id: string): void =>
    dispatch(removeDisplayCredentialSection(id)),
  handleRemoveRequiredCredentialSection: (id: string): void =>
    dispatch(removeRequiredCredentialSection(id)),
  handleUpdateCreator: (formData: FormData): void =>
    dispatch(updateCreator(formData)),
  handleUpdateDisplayCredential: (id: string, formData: FormData): void =>
    dispatch(updateDisplayCredential(id, formData)),
  handleUpdateFilters: (formData: FormData): void =>
    dispatch(updateFilters(formData)),
  handleUpdateOwner: (formData: FormData): void =>
    dispatch(updateOwner(formData)),
  handleUpdatePrivacy: (formData: FormData): void =>
    dispatch(updatePrivacy(formData)),
  handleUpdateTermsOfUse: (formData: FormData): void =>
    dispatch(updateTermsOfUse(formData)),
  handleUpdateVersion: (formData: FormData): void =>
    dispatch(updateVersion(formData)),
  handleUpdateRequiredCredential: (id: string, formData: FormData): void =>
    dispatch(updateRequiredCredential(id, formData)),
  handleValidated: (identifier: string): void =>
    dispatch(validated(identifier)),
  handleValidationError: (identifier: string, errors: string[]): void =>
    dispatch(validationError(identifier, errors)),
  handleGoToStep: (step: number): void => dispatch(goToStep(step)),
  handleUpdateHeadlineMetric: (formData: FormData): void =>
    dispatch(updateHeadlineMetric(formData)),
  handleAddAnalyticsSection: (): void => dispatch(addAnalyticsSection()),
  handleUpdateAnalyticsContent: (id: string, formData: FormData): void =>
    dispatch(updateAnalyticsContent(id, formData)),
  handleRemoveAnalyticsSection: (id: string): void =>
    dispatch(removeAnalyticsSection(id)),
})

export const EditEntitySettingsConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditEntitySettings)
