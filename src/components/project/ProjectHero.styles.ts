import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { deviceWidth } from '../../lib/commonData'

export const HeroContainer = styled.div`
  margin: 0;
  position: relative;
  background: white;
  color: black;
`

export const HeroInner = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 0.875rem;
  line-height: 1rem;
  position: relative;
  padding: 4rem 0 2rem;
  @media (min-width: ${deviceWidth.tablet}px) {
    padding: 3rem 0 2rem;
  }
`

export const Title = styled.h1`
  font-family: ${(props): string => props.theme.fontRobotoCondensed};
  font-weight: normal;
  font-size: 2.25rem;
  line-height: 1.25;

  @media (min-width: 600px) {
    font-size: 2.8125rem;
  }
`

export const Description = styled.p`
  color: #7b8285;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0;
`

export const SingleSDG = styled.a`
  &&& {
    color: ${(props): string => props.theme.fontBlue};
  }
  font-family: ${(props): string => props.theme.fontRobotoCondensed};
  font-weight: 300;
  font-size: 14px;
  margin: 0 10px 0 0;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;

  i {
    font-size: 22px;
    margin-right: 8px;
  }

  i:before {
    width: 50px;
    display: inline-block;
  }

  @media (min-width: ${deviceWidth.tablet}px) {
    i:before {
      width: auto;
    }
  }

  &&&:hover,
  :hover i:before {
    color: ${(props): string => props.theme.fontLightBlue};
  }
`

export const HeroInfoItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  margin: 0.875rem 0.875rem 0.875rem 0;
  font-weight: bold;
  * + span {
    margin-left: 0.5rem;
    @media (min-width: ${deviceWidth.tablet}px) {
      margin-left: 0.875rem;
    }
  }
`

export const Flag = styled.div`
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 1.4rem;
  height: 1rem;
  border-radius: 4px;
`

export const AddClaim = styled(Link)`
  color: white;
  display: inline-block;
  text-align: center;
  background: ${(props): string => props.theme.bg.gradientButton};
  font-size: 15px;
  width: 288px;
  padding: 10px 0;
  font-family: ${(props): string => props.theme.fontRobotoCondensed};
  margin-right: 10px;

  :hover {
    text-decoration: none;
    color: white;
    background: ${(props): string => props.theme.bg.lightBlue};
  }
`

export const SubNavItem = styled(NavLink).attrs({
  activeClassName: 'active',
})`
  color: ${(props): string => props.theme.fontBlue};
  font-family: ${(props): string => props.theme.fontRobotoCondensed};
  font-weight: 300;
  font-size: 14px;
  text-transform: uppercase;

  &.active,
  :hover {
    color: ${(props): string => props.theme.fontBlue};
    text-decoration: underline;
  }

  + span {
    color: ${(props): string => props.theme.fontBlue};
    margin: 0 10px;
  }
`