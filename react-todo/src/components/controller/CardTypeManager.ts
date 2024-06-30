// src/controller/CardTypeManager.ts
import TextContentCard from '../card/models/TextContentCard';
import CodeContentCard from '../card/models/CodeContentCard';
import FileContentCard from '../card/models/FileContentCard';
import WebContentCard from '../card/models/WebContentCard';
import YouTubeVideoCard from '../card/models/YouTubeVideoCard';
import WeatherContentCard from '../card/models/WeatherContentCard';
import SearchContentInApp from '../card/models/SearchContentInApp';
import NoteTakingCard from '../card/notes/NoteTakingCard';
import FluxRssReader from '../card/models/FluxRssReader';
import LoadContentCard from '../card/models/LoadContentCard';
import ToDoList from '../card/todolist/ToDoList';
import HourTime from '../card/times/HourTime';
import ThreadManager from '../thread/ThreadManager';
import DiscordActivity from '../card/appliextern/discord/DiscordActivity';
import WhatsAppActivity from '../card/appliextern/whatsapp/WhatsAppActivity';
import SpotifyActivity from '../card/appliextern/spotify/SpotifyActivity';
import DuckcloudActivity from "../card/appliextern/duckcloud/DuckcloudActivity";
import WindowsAPI from '../card/appliextern/threadextern/WindowsAPI';
import DataConnect from '../card/database/DataConnect';

const cardComponentMap = {
    text: TextContentCard,
    code: CodeContentCard,
    file: FileContentCard,
    web: WebContentCard,
    you: YouTubeVideoCard,
    weather: WeatherContentCard,
    search: SearchContentInApp,
    note: NoteTakingCard,
    rss: FluxRssReader,
    loadContent: LoadContentCard,
    hourTime: HourTime,
    toDoList: ToDoList,
    threadManager: ThreadManager,
    discordActivity: DiscordActivity,
    whatsappActivity: WhatsAppActivity,
    spotifyActivity: SpotifyActivity,
    duckcloudActiviti: DuckcloudActivity,
    windowsAPI: WindowsAPI,
    dataConnect: DataConnect
};

const cardComponentProps: Record<string, any> = {
    web: { query: '' },
    you: { url: '' },
    weather: {},
    text: {},
    rss: {},
    hourTime: {},
    discordActivity: {},
    whatsappActivity: {},
    spotifyActivity: {},
    duckcloudActiviti: {},
    windowsAPI: {},
    dataConnect: {}
};

export type CardType = keyof typeof cardComponentMap;

export { cardComponentMap, cardComponentProps };
