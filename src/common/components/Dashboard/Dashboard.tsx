import React, { createContext } from 'react'
import styled from 'styled-components'
import { deviceWidth } from 'lib/commonData'
import HeaderTabs from 'common/components/HeaderTabs/HeaderTabs'
import { MatchType } from 'types/models'
import Sidebar from './Sidbar'
import Breadcrumb from './Breadcrumb'
import Header from './Header'
import { Path, HeaderTab } from './types'
import { useSelector } from 'react-redux'
import { selectEntityConfig } from 'modules/Entities/EntitiesExplorer/EntitiesExplorer.selectors'
// import { entityTypeMap } from 'modules/Entities/strategy-map'

const Container = styled.div`
  display: block;
  flex: 1 1 auto;
  font-family: ${(props): string => props.theme.secondaryFontFamily};

  @media (min-width: ${deviceWidth.mobile}px) {
    display: flex;
  }
`

const Board = styled.div<{ theme: string }>`
  background: ${({ theme }): string =>
    theme === 'light' ? '#f0f3f9' : '#002233'};

  padding: 2.5rem 0.75rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${deviceWidth.mobile}px) {
    padding: 2rem 2.25rem;
    width: calc(100% - 75px);
  }
`
const Content = styled.div`
  padding: 0.5rem 0rem;
  width: 100%;
  height: 100%;
`

const Break = styled.div`
  @media (max-width: ${deviceWidth.mobile}px) {
    margin: 5px 0;
  }
`

export interface ThemeContext {
  theme: string
  isDark: boolean
}

export const DashboardThemeContext = createContext<ThemeContext>({
  theme: 'light',
  isDark: false,
})

export const DashboardThemes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type DashboardTheme = typeof DashboardThemes[keyof typeof DashboardThemes]

interface Props {
  title: string
  subRoutes: Path[]
  baseRoutes: Path[]
  theme: DashboardTheme
  tabs: HeaderTab[]
  entityType?: string
  matchType?: string
}

const Dashboard: React.FunctionComponent<Props> = ({
  title,
  subRoutes,
  baseRoutes,
  // tabs,
  theme = 'dark',
  children,
  entityType,
  matchType = MatchType.strict,
}) => {
  const entityTypeMap = useSelector(selectEntityConfig)
  return (
    <DashboardThemeContext.Provider value={{ theme, isDark: theme === 'dark' }}>
      <Container>
        <HeaderTabs
          matchType={matchType}
          enableAssistantButton={true}
          activeTabColor={entityTypeMap[entityType]?.themeColor}
        />
        <Sidebar routes={subRoutes} />
        <Board theme={theme}>
          <Breadcrumb subRoutes={subRoutes} baseRoutes={baseRoutes} />
          <Header title={title} />
          <Break />
          <Content>{children}</Content>
        </Board>
      </Container>
    </DashboardThemeContext.Provider>
  )
}

export default Dashboard
