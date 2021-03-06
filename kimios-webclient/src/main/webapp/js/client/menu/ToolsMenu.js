/*
 * Kimios - Document Management System Software
 * Copyright (C) 2012-2013  DevLib'
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
kimios.menu.ToolsMenu = Ext.extend(Ext.Button, {
    constructor: function (config) {
        this.id = 'kimios-tools';
        this.text = kimios.lang('Tools');
        this.iconCls = 'configure';
        this.simpleUser = true;
        this.menu = new Ext.menu.Menu({
            showSeparator: false,
            enableScrolling: true,
            shadow: false
        });

        kimios.menu.ToolsMenu.superclass.constructor.call(this, config);
        this.build();
    },

    build: function () {
        var rights = kimios.explorer.getViewport().rights;
        var simpleUser = true;

        this.adminItem = new Ext.menu.Item({
            text: kimios.lang('Administration'),
            iconCls: 'owner',
            handler: function () {
                Admin.getWindow().show();
            }
        });

        this.studioItem = new Ext.menu.Item({
            text: kimios.lang('Studio'),
            iconCls: 'studio',
            handler: function () {
                Studio.getWindow().show();
            }
        });

        this.rulesItem = new Ext.menu.Item({
            text: kimios.lang('Rules'),
            iconCls: 'configure',
            handler: function () {
                //TODO Rules planned
            }
        });

        this.reportingItem = new Ext.menu.Item({
            text: kimios.lang('Reporting'),
            iconCls: 'reporting',
            handler: function () {
                Reporting.getWindow().show();
            }
        });

        this.aboutItem = new Ext.menu.Item({
            text: kimios.lang('AboutKimios'),
            iconCls: 'about',
            handler: function () {
                var window = new Ext.Window({
                    modal: true,
                    title: kimios.lang('AboutKimios'),
                    iconCls: 'about',
                    closable: true,
                    maximizable: true,
                    width: 300,
                    //height: 250,
                    plain: true,
                    layout: 'fit'
                });
                var aboutPanel = new Ext.Panel({
                    border: false,
                    region: 'center',
                    layout: 'fit',
                    margins: '3 3 3 0',
                    bodyStyle: 'background-color: white; text-align: center;',
                    width: 210,
                    height: 235,
                    html:'' +
                        '<div id="powered" style="margin-top: 20px; margin-bottom: 20px; background-color: white;">' +
                        '    <img src="' + srcContextPath + '/images/logo_kimios_grey.png" style="width: 100px;" />' +
                        '    <div style="text-align: center; margin-top: 20px;"><span style="font-family: arial; font-size: 10px;">powered by</span></div>' +
                        '    <img style="padding:3px; height: 30px" src="images/teclib_logo_white_back.png">' +
                        '    <div style="text-align: center; margin-top: 20px;"><span style="font-family: arial; font-size: 10px;">Version: '+ mavenProjectVersion + '</span></div>' +
                        '    <div style="text-align: center;"><span style="font-family: arial; font-size: 9px; ">Build: ' + mavenBuildNumber + '</span></div>' +
                        '</div>'
                });
                window.add(aboutPanel);
                window.show();
            }
        });

        if (rights.isAdmin == true) {
            this.menu.add(this.adminItem);
            simpleUser = false;
        }
        if (rights.isStudioUser == true) {
            this.menu.add(this.studioItem);
            simpleUser = false;
        }
        if (rights.isRulesUser == true) {
            this.menu.add(this.rulesItem);
            simpleUser = false;
        }
        if (rights.isReportingUser == true) {
            this.menu.add(this.reportingItem);
            simpleUser = false;
        }
        this.menu.add(this.aboutItem);
        this.simpleUser = simpleUser;
    },

    refresh: function () {
        kimios.explorer.getViewport().rightsStore.reload({
            scope: this,
            callback: function (records, options, success) {
                kimios.explorer.getViewport().rights = new kimios.security.Rights({
                    isWorkspaceCreator: records[0].data.canCreateWorkspace,
                    isAdmin: records[0].data.isAdmin,
                    isStudioUser: records[0].data.isStudioUser,
                    isRulesUser: records[0].data.isRulesUser,
                    isReportingUser: records[0].data.isReportingUser
                });
                this.menu.removeAll();
                this.build();
            }
        });
    },

    refreshLanguage: function () {
        this.setText(kimios.lang('Tools'));
        this.adminItem.setText(kimios.lang('Administration'));
        this.studioItem.setText(kimios.lang('Studio'));
        this.rulesItem.setText(kimios.lang('Rules'));
        this.reportingItem.setText(kimios.lang('Reporting'));
    }
});
