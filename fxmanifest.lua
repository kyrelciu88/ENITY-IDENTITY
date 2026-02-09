fx_version 'cerulean'
game 'gta5'

name 'enity_identity'
author 'FiveM Enity'
version '1.0.0'

lua54 'yes'

shared_script 'config.lua'

client_script 'client/main.lua'

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}
