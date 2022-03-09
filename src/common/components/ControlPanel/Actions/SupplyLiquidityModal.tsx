import React, { useEffect, useState, useMemo } from 'react'
import cx from 'classnames'
import Lottie from 'react-lottie'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { StepsTransactions } from 'common/components/StepsTransactions/StepsTransactions'
import PoolSelector from 'common/components/Pool/PoolSelector'
import PoolInfo from 'common/components/Pool/PoolInfo'
import LiquidityAmount from 'common/components/LiquidityAmount/LiquidityAmount'
import { RootState } from 'common/redux/types'

import NextStepIcon from 'assets/images/modal/nextstep.svg'
import EyeIcon from 'assets/images/eye-icon.svg'

import pendingAnimation from 'assets/animations/transaction/pending.json'
import successAnimation from 'assets/animations/transaction/success.json'
import errorAnimation from 'assets/animations/transaction/fail.json'
import CheckIcon from 'assets/images/modal/check.svg'
import AirdropIcon from 'assets/images/exchange/airdrop.svg'
import ArrowUpDownIcon from 'assets/images/exchange/arrow-updown.svg'
import { thousandSeparator } from 'common/utils/formatters'
import { useSelector } from 'react-redux'
import { selectLiquidityPools } from 'modules/Entities/SelectedEntity/EntityExchange/EntityExchange.selectors'
import {
  denomToMinimalDenom,
  findDenomByMinimalDenom,
  findMinimalDenomByDenom,
  minimalDenomToDenom,
} from 'modules/Account/Account.utils'
import { useKeysafe } from 'common/utils/keysafe'

const Container = styled.div`
  position: relative;
  padding: 1.5rem 4rem;
  min-width: 34rem;
  min-height: 25rem;
`

const NextStep = styled.div`
  position: absolute;
  right: 10px;
  bottom: 30px;
  cursor: pointer;
`
const PrevStep = styled.div`
  position: absolute;
  left: 10px;
  bottom: 30px;
  cursor: pointer;
  transform: rotateY(180deg);
`

const TXStatusBoard = styled.div`
  & > .lottie {
    width: 80px;
  }
  & > .status {
    font-weight: 500;
    font-size: 12px;
    letter-spacing: 0.3px;
    color: #5a879d;
    text-transform: uppercase;
  }
  & > .message {
    font-size: 21px;
    color: #ffffff;
    text-align: center;
  }
  & > .transaction {
    border-radius: 100px;
    border: 1px solid #39c3e6;
    padding: 10px 30px;
    cursor: pointer;
  }
`
const CheckWrapper = styled.div`
  position: relative;

  &.pe-none {
    pointer-events: none;
  }
  & > .check-icon {
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

enum TXStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}
interface Props {
  walletType: string
  accountAddress: string
  bondDid: string
}

const SupplyLiquidityModal: React.FunctionComponent<Props> = ({
  // walletType,
  // accountAddress,
  bondDid,
}) => {
  const steps = ['Pool', 'Amount', 'Confirm', 'Sign']
  const { sendTransaction } = useKeysafe()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [APR] = useState(0.67)
  const [amounts, setAmounts] = useState<BigNumber[]>([
    new BigNumber(0),
    new BigNumber(0),
  ])
  const [bondAmount, setBondAmount] = useState<BigNumber>(new BigNumber(0))
  const [signTXStatus, setSignTXStatus] = useState<TXStatus>(TXStatus.PENDING)
  const [signTXhash, setSignTXhash] = useState<string>(null)

  const liquidityPools = useSelector(selectLiquidityPools)
  const { userInfo, usdRate } = useSelector((state: RootState) => state.account)

  const selectedPoolDetail = useMemo(() => {
    if (!bondDid) {
      return undefined
    }
    return (
      liquidityPools.find((pool) => pool.poolID === bondDid)?.poolDetail ??
      undefined
    )
  }, [liquidityPools, bondDid])

  console.log('selectedPoolDetail', selectedPoolDetail)

  const bondDenom = useMemo(() => selectedPoolDetail?.token ?? undefined, [
    selectedPoolDetail,
  ])

  const denoms = useMemo(
    () =>
      selectedPoolDetail?.reserve_tokens.map((token) =>
        findDenomByMinimalDenom(token),
      ) ?? [],
    [selectedPoolDetail],
  )

  const firstBuy = useMemo(
    () => selectedPoolDetail?.current_reserve.length === 0,
    [selectedPoolDetail],
  )

  const liquidityPrice = useMemo(() => {
    if (selectedPoolDetail) {
      const { current_reserve } = selectedPoolDetail
      if (current_reserve.length > 0) {
        const sumOfReserves = current_reserve
          .map((reserve) => minimalDenomToDenom(reserve.denom, reserve.amount))
          .reduce((ac, next) => ac + next, 0)
        return sumOfReserves * usdRate
      }
    }
    return 0
  }, [usdRate, selectedPoolDetail])

  const sanityRateRange = useMemo(() => {
    if (
      selectedPoolDetail &&
      selectedPoolDetail.sanity_rate &&
      selectedPoolDetail.sanity_margin_percentage
    ) {
      const minSanityRate =
        (100 - Number(selectedPoolDetail.sanity_margin_percentage)) *
        Number(selectedPoolDetail.sanity_rate)
      const maxSanityRate =
        (100 + Number(selectedPoolDetail.sanity_margin_percentage)) *
        Number(selectedPoolDetail.sanity_rate)
      return [minSanityRate, maxSanityRate]
    }
    return [0, 0]
  }, [selectedPoolDetail])

  const reserveRatio = useMemo(() => {
    if (
      selectedPoolDetail &&
      selectedPoolDetail.current_reserve &&
      selectedPoolDetail.current_reserve.length > 0
    ) {
      const firstReserveToken = selectedPoolDetail.current_reserve[0]
      const secondReserveToken = selectedPoolDetail.current_reserve[1]

      const firstReserveAmount = minimalDenomToDenom(
        firstReserveToken.denom,
        firstReserveToken.amount,
      )
      const secondReserveAmount = minimalDenomToDenom(
        secondReserveToken.denom,
        secondReserveToken.amount,
      )
      // console.log(
      //   'reserveRatio',
      //   firstReserveAmount,
      //   secondReserveAmount,
      //   new BigNumber(firstReserveAmount).dividedBy(secondReserveAmount),
      // )
      return new BigNumber(firstReserveAmount).dividedBy(secondReserveAmount)
    }
    return new BigNumber(0)
  }, [selectedPoolDetail])

  // methods

  const handleReserveAmountChange = (tokenIdx, amount): void => {
    if (firstBuy) {
      if (tokenIdx === 0) {
        setAmounts([amount, amounts[1]])
      } else if (tokenIdx === 1) {
        setAmounts([amounts[1], amount])
      }
    } else if (!firstBuy) {
      //  Supply a liquidity
      if (tokenIdx === 0) {
        const pairedAmount = new BigNumber(amount).dividedBy(reserveRatio)
        setAmounts([amount, pairedAmount])
      } else if (tokenIdx === 1) {
        const pairedAmount = new BigNumber(amount).multipliedBy(reserveRatio)
        setAmounts([pairedAmount, amount])
      }
    }
  }

  const handlePrevStep = (): void => {
    setCurrentStep(currentStep - 1)
  }
  const handleNextStep = async (): Promise<void> => {
    setCurrentStep(currentStep + 1)
  }

  const handleSubmit = (): void => {
    const msgs = []
    const memo = ''
    const fee = {
      amount: [{ amount: String(5000), denom: 'uixo' }],
      gas: String(200000),
    }
    msgs.push({
      type: 'bonds/MsgBuy',
      value: {
        buyer_did: userInfo.didDoc.did,
        bond_did: bondDid,
        amount: {
          amount: bondAmount,
          denom: selectedPoolDetail.token,
        },
        max_prices: [
          {
            amount: denomToMinimalDenom(denoms[0], amounts[0].toString()),
            denom: findMinimalDenomByDenom(denoms[0]),
          },
          {
            amount: denomToMinimalDenom(denoms[1], amounts[1].toString()),
            denom: findMinimalDenomByDenom(denoms[1]),
          },
        ],
      },
    })
    sendTransaction(msgs, memo, fee, (hash) => {
      if (hash) {
        setSignTXStatus(TXStatus.SUCCESS)
        setSignTXhash(hash)
      } else {
        setSignTXStatus(TXStatus.ERROR)
      }
    })
  }

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      //  last step
      handleSubmit()
    }
    // eslint-disable-next-line
  }, [currentStep])

  const handleViewTransaction = (): void => {
    window
      .open(
        `${process.env.REACT_APP_BLOCK_SCAN_URL}/transactions/${signTXhash}`,
        '_blank',
      )
      .focus()
  }
  const enableNextStep = (): boolean => {
    if (currentStep === 0) return true
    else if (
      currentStep === 1 &&
      new BigNumber(amounts[0]).isGreaterThan(new BigNumber(0)) &&
      new BigNumber(amounts[1]).isGreaterThan(new BigNumber(0)) &&
      ((firstBuy &&
        new BigNumber(bondAmount).isGreaterThan(new BigNumber(0))) ||
        !firstBuy)
    )
      return true
    else if (currentStep === 2) return true
    return false
  }
  const enablePrevStep = (): boolean => {
    return currentStep > 0 && currentStep < 3
  }

  const chooseAnimation = (txStatus): any => {
    switch (txStatus) {
      case TXStatus.PENDING:
        return pendingAnimation
      case TXStatus.SUCCESS:
        return successAnimation
      case TXStatus.ERROR:
        return errorAnimation
      default:
        return ''
    }
  }

  const generateTXMessage = (txStatus: TXStatus): string => {
    switch (txStatus) {
      case TXStatus.PENDING:
        return 'Sign the Transaction'
      case TXStatus.SUCCESS:
        return 'Your transaction was successful!'
      case TXStatus.ERROR:
        return `Something went wrong!\nPlease try again`
      default:
        return ''
    }
  }

  const renderPoolInfoRow = (): JSX.Element =>
    currentStep < 3 && (
      <>
        <CheckWrapper className="mb-3">
          <PoolSelector
            label={bondDid.toUpperCase().substring(0, 14) + '...'}
            logo={AirdropIcon}
            placeholder={selectedPoolDetail?.name}
            border={currentStep === 0}
          />
          {currentStep === 2 && (
            <img className="check-icon" src={CheckIcon} alt="check-icon" />
          )}
        </CheckWrapper>
        <CheckWrapper className="mb-3">
          <PoolInfo
            label={`$${thousandSeparator(
              liquidityPrice.toFixed(0),
              ',',
            )} Liquidity | <span>${(APR * 100).toFixed(0)}% APR</span>`}
            logo={ArrowUpDownIcon}
            placeholder={denoms.join('/')}
            border={currentStep === 0}
          />
          {currentStep === 2 && (
            <img className="check-icon" src={CheckIcon} alt="check-icon" />
          )}
        </CheckWrapper>
      </>
    )
  const renderAmountInputRow = (): JSX.Element =>
    (currentStep === 1 || currentStep === 2) && (
      <CheckWrapper
        className={cx('d-flex', 'justify-content-between', 'mb-3', {
          'pe-none': currentStep === 2,
        })}
      >
        <LiquidityAmount
          amount={amounts[0]}
          denom={denoms[0]}
          setAmount={(amount): void => handleReserveAmountChange(0, amount)}
          disable={currentStep !== 1}
        />
        <LiquidityAmount
          amount={amounts[1]}
          denom={denoms[1]}
          setAmount={(amount): void => handleReserveAmountChange(1, amount)}
          disable={currentStep !== 1}
        />

        {currentStep === 2 && (
          <img className="check-icon" src={CheckIcon} alt="check-icon" />
        )}
      </CheckWrapper>
    )

  const renderBondAmountInputRow = (): JSX.Element =>
    (currentStep === 1 || currentStep === 2) &&
    firstBuy && (
      <CheckWrapper
        className={cx('d-flex', 'justify-content-center', {
          'pe-none': currentStep === 2,
        })}
      >
        <LiquidityAmount
          amount={bondAmount}
          denom={bondDenom}
          setAmount={(amount): void => setBondAmount(amount)}
          disable={currentStep !== 1}
        />

        {currentStep === 2 && (
          <img className="check-icon" src={CheckIcon} alt="check-icon" />
        )}
      </CheckWrapper>
    )

  const renderSignStep = (): JSX.Element =>
    currentStep === 3 && (
      <TXStatusBoard className="mx-4 d-flex align-items-center flex-column">
        <Lottie
          height={120}
          width={120}
          options={{
            loop: true,
            autoplay: true,
            animationData: chooseAnimation(signTXStatus),
          }}
        />
        <span className="status">{signTXStatus}</span>
        <span className="message">{generateTXMessage(signTXStatus)}</span>
        {signTXStatus === TXStatus.SUCCESS && (
          <div className="transaction mt-3" onClick={handleViewTransaction}>
            <img src={EyeIcon} alt="view transactions" />
          </div>
        )}
      </TXStatusBoard>
    )

  if (!selectedPoolDetail) {
    return <Container></Container>
  }

  return (
    <Container>
      <div className="px-4 pb-4">
        <StepsTransactions
          steps={steps}
          currentStepNo={currentStep}
          handleStepChange={(): void => {
            //  handleStepChange
          }}
        />
      </div>

      {renderPoolInfoRow()}

      {renderAmountInputRow()}

      {renderBondAmountInputRow()}

      {renderSignStep()}

      {enableNextStep() && (
        <NextStep onClick={handleNextStep}>
          <img src={NextStepIcon} alt="next-step" />
        </NextStep>
      )}
      {enablePrevStep() && (
        <PrevStep onClick={handlePrevStep}>
          <img src={NextStepIcon} alt="prev-step" />
        </PrevStep>
      )}
    </Container>
  )
}

export default SupplyLiquidityModal
